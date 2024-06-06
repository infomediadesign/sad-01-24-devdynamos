from mongoengine import Document, StringField, EmailField, IntField, DateTimeField, ListField, ReferenceField
import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = EmailField(required=True, unique=True)
    age = IntField(required=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    hasRole = StringField(default='default')

    meta = {'collection': 'users'}

class Session(Document):
    username = StringField(required=True, unique=True)
    tokens = ListField(StringField())
    
    meta = {'collection': 'sessions'}