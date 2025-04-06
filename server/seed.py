from app import db,app
from model import User, Chat, Message, MessageStatus, ChatMembers
import uuid


#SESSION

def seed():
    user_1=User(id=str(uuid.uuid4()), name="Alice", phone_number="+254773470576")
    user_2=User(id=str(uuid.uuid4()), name="Bob", phone_number="+254773470576")
    user_3=User(id=str(uuid.uuid4()), name="Charlie", phone_number="+254773470576")

    db.session.add_all([user_1, user_2, user_3])
    db.session.commit()

if __name__=="__main__":
    with app.app_context():
        seed()