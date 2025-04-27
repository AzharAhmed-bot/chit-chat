from chat import db, app
from model import User, Chat, Message, ChatMembers, Group
import uuid
from datetime import datetime



#SESSION

def seed():

    user_1=User(id=uuid.uuid4(), name="Alice", phone_number="+254773470576",profile_picture="https://i.pinimg.com/474x/bf/e4/8c/bfe48c46e66c8e045e5382283201cb54.jpg")
    user_2=User(id=uuid.uuid4(), name="Bob", phone_number="+254773470577",profile_picture="https://i.pinimg.com/474x/bf/e4/8c/bfe48c46e66c8e045e5382283201cb54.jpg")
    user_3=User(id=uuid.uuid4(), name="Charlie", phone_number="+254773470578",profile_picture="https://i.pinimg.com/474x/bf/e4/8c/bfe48c46e66c8e045e5382283201cb54.jpg")
    
   

    private_chat = Chat(id=uuid.uuid4(), is_group=False, createdAt=db.func.current_timestamp())
    db.session.add(private_chat)
    db.session.commit()

    db.session.add_all([
        ChatMembers(user_id=user_1.id, chat_id=private_chat.id, joined_at=db.func.current_timestamp()),
        ChatMembers(user_id=user_2.id, chat_id=private_chat.id, joined_at=db.func.current_timestamp())
    ])
    db.session.commit()

    group_chat = Chat(id=uuid.uuid4(), is_group=True, createdAt=db.func.current_timestamp())
    db.session.add(group_chat)
    db.session.commit()

    group = Group(
        id=group_chat.id,
        name="Study Group",
        description="A group of developers",
        created_by=user_1.id,
        created_at=db.func.current_timestamp()
    )

    db.session.add(group)
    db.session.commit()

    db.session.add_all([
        ChatMembers(user_id=user_1.id, chat_id=group_chat.id, joined_at=db.func.current_timestamp()),
        ChatMembers(user_id=user_2.id, chat_id=group_chat.id, joined_at=db.func.current_timestamp()),
        ChatMembers(user_id=user_3.id, chat_id=group_chat.id, joined_at=db.func.current_timestamp())
    ])
    db.session.commit()

    message_1=Message(id=uuid.uuid4(),user_id=user_1.id,chat_id=private_chat.id,type="text",content='Hey girl',sent_at=datetime.utcnow(),seen_at=datetime.utcnow())
    message_2=Message(id=uuid.uuid4(),user_id=user_2.id,chat_id=private_chat.id,type="text",content='girllly',sent_at=datetime.utcnow())
    db.session.add_all([message_1,message_2])
    db.session.commit()
     
    #Bulk adding
    db.session.add_all([user_1, user_2, user_3])
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        seed()