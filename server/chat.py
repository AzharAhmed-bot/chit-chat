from flask import Flask, make_response, jsonify, request, session
from flask_restful import Api, Resource
from model import db, User
from config import AppConfig
import uuid

# Flask app setup
app = Flask(__name__)
app.config.from_object(AppConfig)
app.secret_key = 'super-secret-key'  # Flask session key
db.init_app(app)
api = Api(app)
# with app.app_context():
#     db.drop_all()
#     db.create_all()


# Simulated OTP store (in-memory)
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
                token = str(uuid.uuid4())
                session['user'] = {
                    'phone_number': phone_number,
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

class Logout(Resource):
    def post(self):
        data = request.get_json()
        phone_number = data.get('phone_number')
        user = User.query.filter_by(phone_number=phone_number).first()
        if user:
            return {'message': 'Logout success'}, 200
        else:
            return {'message': 'User not found'}, 404

api.add_resource(Logout, '/logout')

if __name__ == "__main__":
    app.run(port=5000, debug=True)





















