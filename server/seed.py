from app import db,app
from model import User, Chat, Message, MessageStatus, ChatMembers
import uuid
from datetime import datetime

#SESSION

def seed():
    user_1=User(id=str(uuid.uuid4()), name="Alice", phone_number="+254773470576")
    user_2=User(id=str(uuid.uuid4()), name="Bob", phone_number="+254773470576")
    user_3=User(id=str(uuid.uuid4()), name="Charlie", phone_number="+254773470576")
    message_1=Message(id=str(uuid.uuid4()),user_id=user_1.id,chat_id=Chat.id,type="text",content='Hey girl',sent_at=datetime.utcnow())
    message_2=Message(id=str(uuid.uuid4()),user_id=user_2.id,chat_id=Chat.id,type="text",content='girllly',sent_at=datetime.utcnow())
     
    message_status1=MessageStatus(user_id=User.id,message_id=Message.id,delivered_at=datetime.utcnow(),seen_at=datetime.utcnow() )

    db.session.add_all([user_1, user_2, user_3,message_1,message_2])
    db.session.commit()
   

if __name__=="__main__":
    with app.app_context():
        seed()