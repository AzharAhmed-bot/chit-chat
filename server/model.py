# Will hold the database structure
# Create tables in SQL
# CREATE OR REPLACE TABLE users;

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
import re

db=SQLAlchemy()
email_pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
phone_pattern = r'^\+?[1-9]\d{1,14}$'



class User(db.Model,SerializerMixin):
    # define the columns of the model as class attributes
    __tablename__='users'
    serializer_rules=('-user_groups.user')

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

class Groups(db.Model):
    __tablename__='groups'
    #Rules
    serializer_rules=('-user_groups.groups')
    id=db.Column(db.Integer,primary_key=True)

class User_groups(db.Model, SerializerMixin):
    __tablename__='user_groups'
    # Rules
    serializer_rules=('-user','-groups')
    
    
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    group_id=db.Column(db.Integer,db.ForeignKey('groups.id'),nullable=False)

    user=db.relationship('User',backref='user_groups')
    groups=db.relationship('Groups',backref='user_groups')






















    