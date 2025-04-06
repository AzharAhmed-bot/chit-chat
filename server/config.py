import os
from dotenv import load_dotenv

load_dotenv()


class AppConfig:
    SQLALCHEMY_DATABASE_URI ='sqlite:///chitchat.db'
    SECRET_KEY = os.environ['SECRET_KEY']
