from pydantic import BaseModel
from typing import List


class User(BaseModel):
    name: str
    email: str
    password: str
    blogs: List['Blog'] = []

    class Config:
        from_attributes = True
class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class Blog(BaseModel):
    title: str
    body: str


class BlogResponse(BaseModel):
    id: int
    title: str
    body: str
    owner: UserResponse   # 👈 USER INCLUDED

    class Config:
        from_attributes = True


class Login(BaseModel):
    username:str
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None




class Program(BaseModel):
    name: str
    description: str
    start_date: str
    end_date: str

    class Config:
        from_attributes = True


class ProgramResponse(BaseModel):
   
    name:str
    description:str
    start_date:str
    end_date:str

    class Config:
        from_attributes = True



class Service(BaseModel):
    id:int
    name:str
    description:str
    price:float
    
    class Config:
        from_attributes = True

class ServiceResponse(BaseModel):
    name:str
    description:str
    price:float

    class Config:
        from_attributes = True



class Enrollment_Service(BaseModel):
    service_id: int
    date_enrolled: str
    status: str

    class Config:
        from_attributes = True



class Enrollment_Program(BaseModel):
    program_id: int
    user_id: int
    date_enrolled: str
    status: str

    class Config:
        from_attributes = True


class Event(BaseModel):
    id:int
    name:str
    description:str
    location:str
    date:str

    class Config:
        from_attributes = True

class EventResponse(BaseModel):
    name:str
    description:str
    location:str
    date:str

    class Config:
        from_attributes=True
