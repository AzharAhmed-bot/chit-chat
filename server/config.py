import os
from dotenv import load_dotenv
from model import db
load_dotenv()


class AppConfig:
    SESSION_TYPE='sqlalchemy'
    SESSION_PARMANENT=True
    SESSION_SQLALCHEMY=db
    SQLALCHEMY_DATABASE_URI ='sqlite:///chitchat.db'
    SECRET_KEY = os.environ['SECRET_KEY']
