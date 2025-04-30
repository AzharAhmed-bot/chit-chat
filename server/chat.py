from datetime import datetime
from flask import Flask, make_response, jsonify, request, session
from flask_socketio import SocketIO, emit,join_room, leave_room
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_session import Session
from flask_jwt_extended import JWTManager, create_access_token
from flask_bcrypt import Bcrypt
from uuid import UUID
from collections import defaultdict

from config import AppConfig
from model import db, User, Chat, ChatMembers, Message, Group

app = Flask(__name__)
app.config.from_object(AppConfig)

# Initialize extensions
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
Session(app)
bcrypt = Bcrypt(app)
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:5173"],
    manage_session=False,
    async_handlers=True,
    logger=True,
    engineio_logger=True
)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# with app.app_context():
#     db.create_all()

@app.route('/')
def index():
    return make_response(jsonify({'message': 'Hello World!'}), 200)

@app.before_request
def make_session_permanent():
    session.permanent = True

# ——— Auth endpoints ———————————————————————————————————

simulated_otp_store = {}
connected_users=defaultdict(bool)

class NewUser(Resource):
    def post(self):
        data = request.get_json()
        user = User(
            name=data.get('name'),
            phone_number=data.get('phone_number')
        )
        db.session.add(user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        mode = data.get('mode')
        phone = data.get('phone_number')
        if not mode or not phone:
            return {'message': 'Mode and phone number required'}, 400

        user = User.query.filter_by(phone_number=phone).first()

        if mode == 'request':
            if not user:
                return {'message': 'Phone number not found'}, 404
            otp = 334322
            simulated_otp_store[phone] = otp
            session['otp_requested'] = True
            print(f"Simulated OTP for {phone}: {otp}")
            return {'message': 'OTP sent successfully (simulated)'}, 200

        elif mode == 'verify':
            otp = data.get('otp')
            if str(simulated_otp_store.get(phone)) == str(otp):
                token = create_access_token(identity=phone)
                session['user'] = {'user_id': str(user.id), 'token': token}
                simulated_otp_store.pop(phone, None)
                session.pop('otp_requested', None)
                return {'message': 'OTP verified', 'token': token}, 200
            return {'message': 'Invalid or expired OTP'}, 401

        return {'message': 'Invalid mode'}, 400

api.add_resource(NewUser, '/users')
api.add_resource(Login, '/login')

# ——— Main chat endpoints —————————————————————————————————

class UserChats(Resource):
    def get(self):
        user_sess = session.get('user')
        if not user_sess:
            return {'message': 'Unauthorized'}, 401

        user_id = UUID(user_sess['user_id'])
        memberships = ChatMembers.query.filter_by(user_id=user_id).all()
        result = []

        for m in memberships:
            chat = Chat.query.get(m.chat_id)
            if not chat:
                continue

            # Determine chat name
            if chat.is_group:
                grp = Group.query.get(chat.id)
                chat_name = grp.name if grp else "Unnamed Group"
            else:
                other = ChatMembers.query.filter(
                    ChatMembers.chat_id == chat.id,
                    ChatMembers.user_id != user_id
                ).first()
                other_user = User.query.get(other.user_id) if other else None
                chat_name = other_user.name if other_user else "Unknown User"

            # Fetch latest message
            latest = (
                Message.query
                .filter_by(chat_id=chat.id)
                .order_by(Message.sent_at.desc())
                .first()
            )
            

            if latest:
                latest_content = latest.content
                latest_at = latest.sent_at.isoformat()

                # Lookup sender
                sender = User.query.get(latest.user_id)
                if sender:
                    by_user = {
                        'user_id': str(sender.id),
                        'name': sender.name
                    }
                else:
                    by_user = {
                        'user_id': str(latest.user_id),
                        'name': None
                    }
            else:
                latest_content = None
                latest_at = None
                by_user = None

            result.append({
                'chat_id': str(chat.id),
                'chat_name': chat_name,
                'is_group': chat.is_group,
                'latest_message': {
                    'content': latest_content,
                    'by_user': by_user
                },
                'latest_message_at': latest_at
            })

        return {'chats': result}, 200


class ChatMessages(Resource):
    def get(self, chat_id):
        cid = UUID(chat_id)
        chat = Chat.query.get(cid)
        if not chat:
            return {'message': 'Chat not found'}, 404

        msgs = (
            Message.query
            .filter_by(chat_id=cid)
            .order_by(Message.sent_at)
            .all()
        )
        payload = [{
            'user_id': str(m.user_id),
            'content': m.content,
            'sent_at': m.sent_at.isoformat(),
            "seen_at":m.seen_at.isoformat() if m.seen_at else None,
            "deleted_at": m.deleted_at.isoformat() if m.deleted_at else None
        } for m in msgs]

        return make_response(jsonify({
            'chat_id': chat_id,
            'messages': payload
        }), 200)

    def post(self, chat_id):
        data = request.get_json()
        print(data)
        user_id = session.get('user').get('user_id')
        content = data.get('content')
        sent_at=data.get('sent_at')
        if not user_id or not content:
            return {'message': 'user_id and content required'}, 400

        new_msg = Message(
            chat_id=UUID(chat_id),
            user_id=UUID(user_id),
            type="text",
            content=content,
        )
        db.session.add(new_msg)
        try:
            db.session.commit()
            payload={
                "chat_id":chat_id,
                "user_id":user_id,
                "content":content,
                "sent_at":sent_at
            }
            socketio.emit('new_message', payload, room=chat_id)
            return {'message': 'Message sent successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(e)
            return {'message': f'Error: {str(e)}'}, 500

class Logout(Resource):
    def post(self):
        session.clear()
        return {'message': 'Logout success'}, 200

class UserStatus(Resource):
    def get(self, user_id):
        return {'is_online': connected_users.get(user_id, False)}, 200
    

api.add_resource(UserStatus, '/user-status/<string:user_id>')
api.add_resource(UserChats, '/chats')
api.add_resource(ChatMessages, '/messages/<string:chat_id>')
api.add_resource(Logout, '/logout')

@socketio.on('check_auth')
def check_auth():
    user = session.get('user')
    emit('auth_status', {
        'isAuthenticated': bool(user),
        'user': user['user_id'] if user else None
    })

@socketio.on('join_room')
def handle_join_room(data):
    chat_id = data.get('chat_id')
    if chat_id:
        join_room(chat_id)
        print(f"User joined room: {chat_id}")

@socketio.on('leave_room')
def handle_leave_room(data):
    chat_id = data.get('chat_id')
    if chat_id:
        leave_room(chat_id)
        print(f"User left room: {chat_id}")

@socketio.on('connect')
def handle_connect():
    user = session.get('user')
    if user:
        connected_users[user['user_id']] = True
        emit('user_status',{
            "user":user['user_id'],
            "is_connected":True
        },broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    user = session.get('user')
    if user:
        connected_users[user['user_id']] = False
        emit('user_status',{
            "user":user['user_id'],
            "is_connected":False
        },broadcast=True)


if __name__ == "__main__":
    socketio.run(app, port=5000, debug=True)
