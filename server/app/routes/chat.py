from flask import Flask,make_response,jsonify,request
from flask_restful import Api,Resource
from model import db,User
from config import AppConfig



app=Flask(__name__)
app.config.from_object(AppConfig)
db.init_app(app)
api=Api(app)

@app.route('/')
def index():
    return make_response(jsonify({'message': 'Hello World!'}),200)

class NewUser(Resource):
    def post(self):
        data = request.get_json()
        name=data.get('name')
        phone_number=data.get('phone_number')
        user=User(name=name,phone_number=phone_number)
        db.session.add(user)
        db.session.commit()
        return {'message':'User created successfully'},201
    
api.add_resource(NewUser, '/users')
    

class Login(Resource):
    def post(self):
        data = request.get_json()
        phone_number = data.get('phone_number')
        user = User.query.filter_by(phone_number=phone_number).first()
        if user:
            return {'message': 'Login sucess'}, 200
        else:
            return {'message': 'Invalid phone number or user not found'}, 404

api.add_resource(Login, '/login')






if __name__=="__main__":
    app.run(port=5000,debug=True)

# with app.app_context():
#     db.create_all()

























