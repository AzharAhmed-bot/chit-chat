from flask import Flask, make_response, jsonify, request, session
from flask_restful import Api, Resource
from flask_session import Session
from flask_jwt_extended import JWTManager,create_access_token
from model import db, User,Chat,ChatMembers,Message
from config import AppConfig
from uuid import UUID

import uuid

# Flask app setup
app = Flask(__name__)
app.config.from_object(AppConfig)
db.init_app(app)
api = Api(app)
jwt=JWTManager(app)
sess=Session(app)

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
        user_id = uuid.UUID(user['user_id'])
        chat_members=ChatMembers.query.filter_by(user_id=user_id).all()
        return {
            'People': [
                {
                    'id': str(chat.chat_id),

                } for chat in chat_members
            ]
        }, 200
        

api.add_resource(Chats, '/chats')

class ChatMessages(Resource):
    def get(self,chat_id):
        chat_id = UUID("87703d8a-8f84-4a06-b85c-362053a74589")
        chat=Chat.query.get(chat_id)
        if not chat:
            return{'message':'chat not found'},404
        messages=Message.query.filter_by(chat_id=chat_id).order_by(Message.sent_at).all()
        message_list=[
            {
            'userid':str(message.user_id),
            'content':message.content
            }for message in messages
        ]
        return{
            'id':str(chat_id),
            'messages':message_list
        },200





class Logout(Resource):
    def post(self):
        session.pop('user', None)  # Removes session
        return {'message': 'Logout success'}, 200
    
api.add_resource(Logout, '/logout')

if __name__ == "__main__":
    app.run(port=5000, debug=True)





















