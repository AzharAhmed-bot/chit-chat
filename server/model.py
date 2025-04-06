# # Will hold the database structure
# # Create tables in SQL
# # CREATE OR REPLACE TABLE users;
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
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

    id=db.Column(db.String(36),primary_key=True,default=lambda: str(uuid.uuid4()))
    name=db.Column(db.String(100), nullable=False)
    phone_number=db.Column(db.String(100), nullable=False)
    created_at=db.Column(db.DateTime,default=db.func.current_timestamp())
    updated_at=db.Column(db.DateTime,default=db.func.current_timestamp(),onupdate=db.func.current_timestamp())
    

    

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
     created_by=db.Column(UUID(as_uuid=True),db.ForeignKey('users.id'),nullable=False)
     created_at=db.Column(db.DateTime,default=db.func.current_timestamp())


class ChatMembers(db.Model):
    __tablename__='chat_members'
    user_id=db.Column(UUID(as_uuid=True),db.ForeignKey('users.id'),primary_key=True)
    chat_id_id=db.Column(UUID(as_uuid=True),db.ForeignKey('chats.id'),primary_key=True)
    joined_at=db.Column(db.DateTime,default=db.func.current_timestamp())
    left_at=db.Column(db.DateTime)


class Chat(db.Model):
    __tablename__='chats'
    id=db.Column(db.String(36),primary_key=True,default=lambda :str(uuid.uuid4()))
    is_group=db.Column(db.Boolean,default=False)
    createdAt=db.Column(db.DateTime,default=db.func.current_timestamp())


class Message(db.Model):
    __tablename__='messages'
    id=db.Column(db.String(36),primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey('users.id'),nullable=False)
    chat_id=db.Column(db.String(36),db.ForeignKey('chats.id'),nullable=False)
    type=db.Column(db.String(20))
    content=db.Column(db.Text)
    sent_at = db.Column(db.DateTime, default=db.func.current_timestamp())  
    deleted_at=db.Column(db.DateTime)
    
class MessageStatus(db.Model):
    __tablename__='message_status'
    user_id=db.Column(db.String(36),db.ForeignKey('users.id'),primary_key=True)
    Message_id=db.Column(db.String(36),db.ForeignKey('messages.id'),primary_key=True)
    delivered_at=db.Column(db.DateTime)
    seen_at=db.Column(db.DateTime)
    




















    