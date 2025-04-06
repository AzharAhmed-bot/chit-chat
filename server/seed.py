from app import db, app
from model import User, Chat, Message, MessageStatus, ChatMembers, Group
import uuid


#SESSION

def seed():
    user_1 = User(id=uuid.uuid4(), name="Alice", phone_number="+254773470576")
    user_2 = User(id=uuid.uuid4(), name="Bob", phone_number="+254773470576")
    user_3 = User(id=uuid.uuid4(), name="Charlie", phone_number="+254773470576")

    db.session.add_all([user_1, user_2, user_3])
    db.session.commit()

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


if __name__ == "__main__":
    with app.app_context():
        seed()