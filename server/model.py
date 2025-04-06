# # Will hold the database structure
# # Create tables in SQL
# # CREATE OR REPLACE TABLE users;

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
# from sqlalchemy_serializer import SerializerMixin
import re

db=SQLAlchemy()
email_pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
phone_pattern = r'^\+?[1-9]\d{1,14}$'



class User(db.Model):
    # define the columns of the model as class attributes
    __tablename__='users'
    # serializer_rules=('-user_groups.user')

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100), nullable=False)
    email=db.Column(db.String(100), nullable=False,unique=True)
    phone_number=db.Column(db.String(100), nullable=False)
    password=db.Column(db.String(100),nullable=False)

    @validates('email')
    def validate_email(self,key,value):
        if not re.match(email_pattern,value):
            raise ValueError('Invalid email')
        return value

    @validates('phone_number')
    def validate_phone_number(self,key,value):
        if not re.match(phone_pattern,value):
            raise ValueError('Invalid phone number')
        return value
    # messages=db.relationship('Message',backref='user')
    # chats=db.relationship('UserChat',backref='user')
    
class Group(db.Model):
     __tablename__='groups'
     id=db.Column(db.String(36),db.ForeignKey('chats.id'),primary_key=True)
     name=db.Column(db.String(100),nullable=False)
     description=db.Column(db.Text)
     createdBy=db.Column(db.String(36),db.ForeignKey('users.id'),nullable=False)
     createdAt=db.Column(db.DateTime,default=db.func.current_timestamp())
class UserChat(db.Model):
    __tablename__='users_chats'
    id=db.Column(db.String(36),primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey('users.id'),nullable=False)
    chat_id=db.Column(db.String(36),db.ForeignKey('chats.id'),nullable=False)
class Chat(db.Model):
    __tablename__='chats'
    id=db.Column(db.String(36),db.ForeignKey('chats.id'),primary_key=True)
    is_group=db.Column(db.Boolean,default=False)
    createdAt=db.Column(db.DateTime,default=db.func.current_timestamp())
class Message(db.Model):
    __tablename__='messages'
    id=db.Column(db.String(36),primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey('users.id'),nullable=False)
    chat_id=db.Column(db.String(36),db.ForeignKey('chats.id'),nullable=False)
    type=db.Column(db.String(20))
    content=db.Column(db.Text)
    sentAt = db.Column(db.DateTime, default=db.func.current_timestamp())  
    deliveredAt=db.Column(db.DateTime)
    seenAt=db.Column(db.DateTime)























    