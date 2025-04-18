import os
from datetime import timedelta
from dotenv import load_dotenv
from model import db

load_dotenv()

class AppConfig:
    # Session configuration
    SESSION_TYPE = 'SqlAlchemy'
    SESSION_PERMANENT = True
    SESSION_SQLALCHEMY = db
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    
    # Cookie settings
    SESSION_COOKIE_SECURE = False  
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_USE_SIGNER = True

    
    # Database and security
    SQLALCHEMY_DATABASE_URI = 'sqlite:///chitchat.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ['SECRET_KEY']
