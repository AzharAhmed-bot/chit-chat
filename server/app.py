# from flask_socketio import SocketIO, emit
# from config import AppConfig
# from flask_cors import CORS
# from flask import Flask, jsonify, make_response,request

# app = Flask(__name__)
# app.config.from_object(AppConfig)
# socketio = SocketIO(app, cors_allowed_origins='*')
# CORS(app, supports_credentials=True)

# users = {}

# @app.route('/')
# def index():
#     response = make_response(jsonify({'message': 'Hello World!'}))
#     return response

# @socketio.on('connect')
# def handle_connect():
#     print(f'Client connected: {request.sid}')
#     users[request.sid] = f"User {len(users)+1}"
#     emit("user_connected", {"user": users[request.sid]}, broadcast=True)

# @socketio.on('send_message')
# def handle_message(data):
#     sender_id = request.sid
#     message = data['message']
#     print(f"Message from {users[sender_id]}: {message}")
#     emit("received_message", {"user": users[sender_id], "message": message}, broadcast=True)

# @socketio.on('disconnect')
# def handle_disconnect():
#     user = users.pop(request.sid, "Unknown User")
#     print(f'{user} disconnected')
#     emit('user_disconnected', {"user": user}, broadcast=True)

# if __name__ == '__main__':
#     socketio.run(app, debug=True, port=5000)


from flask import Flask
from model import db
from config import AppConfig

app=Flask(__name__)
app.config.from_object(AppConfig)
db.init_app(app)

with app.app_context():
    db.create_all()























