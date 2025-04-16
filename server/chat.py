from datetime import datetime
from flask import Flask, make_response, jsonify, request, session
from flask_socketio import SocketIO,join_room,emit
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_session import Session
from flask_jwt_extended import JWTManager,create_access_token
from model import db, User,Chat,ChatMembers,Message,Group
from config import AppConfig
from uuid import UUID
import uuid

import uuid

# Flask app setup
app = Flask(__name__)
app.config.from_object(AppConfig)
db.init_app(app)
api = Api(app)
jwt=JWTManager(app)
sess=Session(app)
socketio=SocketIO(app,cors_allowed_origins="*")
CORS(app, supports_credentials=True)



# with app.app_context():
#     db.drop_all()
#     db.create_all()




# Server side sessioning 
simulated_otp_store = {}

@app.route('/')
def index():
    return make_response(jsonify({'message': 'Hello World!'}), 200)

class NewUser(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        phone_number = data.get('phone_number')
        user = User(name=name, phone_number=phone_number)
        db.session.add(user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

api.add_resource(NewUser, '/users')

class Login(Resource):
    def post(self):
        data = request.get_json()
        mode = data.get('mode')
        phone_number = data.get('phone_number')

        if not mode or not phone_number:
            return {'message': 'Mode and phone number are required'}, 400

        user = User.query.filter_by(phone_number=phone_number).first()

        # Mode "request" - Send OTP if user exists
        if mode == 'request':
            if not user:
                return {'message': 'Phone number not found'}, 404
            simulated_otp = 334322  # Simulated OTP
            simulated_otp_store[phone_number] = simulated_otp
            session['otp_requested'] = True
            print(session['otp_requested'])
            print(f"Simulated OTP for {phone_number}: {simulated_otp}")
            return {'message': 'OTP sent successfully (simulated)'}, 200

        # Mode "verify" - Verify OTP sent to the phone number
        elif mode == 'verify':
            otp = data.get('otp')
            if not otp:
                return {'message': 'OTP is required for verification'}, 400
            expected_otp = simulated_otp_store.get(phone_number)
            if expected_otp and str(expected_otp) == str(otp):
                token=create_access_token(identity=phone_number)
                session['user'] = {
                    'user_id': user.id,
                    'token': token
                }
                simulated_otp_store.pop(phone_number, None)
                session.pop('otp_requested', None)
                return {
                    'message': 'OTP verified successfully',
                    'token': token
                }, 200
            else:
                return {'message': 'Invalid or expired OTP'}, 401
        else:
            return {'message': 'Invalid mode. Use "request" or "verify".'}, 400

api.add_resource(Login, '/login')




class Chats(Resource):
    def get(self):
        user = session.get('user')
        if not user:
            return {'message': 'Unauthorized'}, 401

        user_id = uuid.UUID(user['user_id'])
        chat_memberships = ChatMembers.query.filter_by(user_id=user_id).all()
        print(chat_memberships)
        result = []

        for membership in chat_memberships:
            chat = Chat.query.get(membership.chat_id)

            if chat.is_group:
                group = Group.query.filter_by(id=chat.id).first()
                chat_name = group.name if group else "Unnamed Group"
            else:
                # Get the other user in the chat
                other_membership = ChatMembers.query.filter(
                    ChatMembers.chat_id == chat.id,
                    ChatMembers.user_id != user_id
                ).first()
                other_user = User.query.get(other_membership.user_id) if other_membership else None
                chat_name = other_user.name if other_user else "Unknown User"

            result.append({
                'chat_id': str(chat.id),
                'chat_name': chat_name,
                'is_group': chat.is_group
            })

        return {'chats': result}, 200
        

api.add_resource(Chats, '/chats')

class ChatMessages(Resource):
    def get(self, chat_id):
        chat_id = UUID(chat_id)
        chat = Chat.query.get(chat_id)

        if not chat:
            return {'message': 'chat not found'}, 404

        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.sent_at).all()
        message_list = [
            {
                'user_id': str(message.user_id),
                'content': message.content
            } for message in messages
        ]

        return make_response(jsonify({
            'chat_id': str(chat_id),
            'messages': message_list
        }), 200)
    
    def post(self, chat_id):
        data = request.get_json()
        user_id = data.get('user_id')
        content = data.get('content')

        if not user_id or not content:
            return {'message': 'user_id and content are required'}, 400
        
        new_message = Message(
            id=uuid.uuid4(),
            chat_id=UUID(chat_id),
            user_id=UUID(user_id),
            type="text",
            content=content,
            sent_at=datetime.utcnow()
        )
        
        try:
            db.session.add(new_message)
            db.session.commit()
            return {'message': 'Message sent successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error sending message: {str(e)}'}, 500
    

# Modified to receive chat id as a parameter
api.add_resource(ChatMessages, '/messages/<string:chat_id>')


class Logout(Resource):
    def post(self):
        session.pop('user', None)  # Removes session
        return {'message': 'Logout success'}, 200
    
api.add_resource(Logout, '/logout')





if __name__ == "__main__":
    socketio.run(app,port=5000, debug=True)





















