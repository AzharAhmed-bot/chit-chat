# # Will hold the database structure
# # Create tables in SQL
# # CREATE OR REPLACE TABLE users;
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
# from sqlalchemy_serializer import SerializerMixin
import re
from datetime import datetime

db=SQLAlchemy()
email_pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
phone_pattern = r'^\+?[1-9]\d{1,14}$'



class User(db.Model):
    # define the columns of the model as class attributes
    __tablename__='users'
    # serializer_rules=('-user_groups.user')

    id=db.Column(UUID(as_uuid=True),primary_key=True,default=lambda: uuid.uuid4(),nullable=False,unique=True)
    name=db.Column(db.String(100), nullable=False)
    phone_number=db.Column(db.String(20), nullable=False, unique=True)
    created_at =db.Column(db.DateTime, default=datetime.utcnow)
    updated_at =db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    profile_picture=db.Column(db.Text)

    

    @validates('phone_number')
    def validate_phone_number(self,key,value):
        if not re.match(phone_pattern,value):
            raise ValueError('Invalid phone number')
        return value

    
class Group(db.Model):
     __tablename__='groups'
     id=db.Column(UUID(as_uuid=True),db.ForeignKey('chats.id'),primary_key=True,default=lambda: uuid.uuid4(),nullable=False,unique=True)
     name=db.Column(db.String(100),nullable=False)
     description=db.Column(db.Text)
     created_by=db.Column(UUID(as_uuid=True),db.ForeignKey('users.id'),nullable=False)
     created_at=db.Column(db.DateTime,default=db.func.current_timestamp())


class ChatMembers(db.Model):
    __tablename__='chat_members'
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey('users.id'),primary_key=True)
    chat_id=db.Column(UUID(as_uuid=True),db.ForeignKey('chats.id'),primary_key=True)
    joined_at=db.Column(db.DateTime,default=db.func.current_timestamp())
    left_at=db.Column(db.DateTime)


class Chat(db.Model):
    __tablename__='chats'
    id=db.Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4(),nullable=False,unique=True)
    is_group=db.Column(db.Boolean,default=False)
    createdAt=db.Column(db.DateTime,default=db.func.current_timestamp())
    
    messages = db.relationship('Message', backref='chat', lazy=True)



class Message(db.Model):
    __tablename__='messages'
    id=db.Column(UUID(as_uuid=True),primary_key=True,default=lambda: uuid.uuid4(),nullable=False,unique=True)
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey('users.id'),nullable=False)
    chat_id=db.Column(UUID(as_uuid=True),db.ForeignKey('chats.id'),nullable=False)
    type=db.Column(db.String(20))
    content=db.Column(db.Text)
    sent_at=db.Column(db.DateTime,default=db.func.current_timestamp())
    seen_at=db.Column(db.DateTime)
    deleted_at=db.Column(db.DateTime)
    




















    