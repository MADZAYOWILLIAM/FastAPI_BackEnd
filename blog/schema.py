from pydantic import BaseModel
from typing import List


class User(BaseModel):
    name: str
    email: str
    password: str
    phone_number: str | None = None
    role: str = "member"
    blogs: List['Blog'] = []

    class Config:
        from_attributes = True
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: str | None = None
    role: str

    class Config:
        from_attributes = True


class Blog(BaseModel):
    title: str
    body: str
    image_url: str | None = None


class BlogResponse(BaseModel):
    id: int
    title: str
    body: str
    image_url: str | None = None
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
    image_url: str | None = None

    class Config:
        from_attributes = True


class ProgramResponse(BaseModel):
   
    name:str
    description:str
    start_date:str
    start_date:str
    end_date:str
    image_url: str | None = None

    class Config:
        from_attributes = True



class ServiceCreate(BaseModel):
    name:str
    description:str
    
    
    price:float
    image_url: str | None = None

    class Config:
        from_attributes = True

class Service(BaseModel):
    id:int
    name:str
   
    description:str
    description:str
    price:float
    image_url: str | None = None
    
    class Config:
        from_attributes = True

class ServiceResponse(BaseModel):
    name:str
    description:str
    description:str
    price:float
    image_url: str | None = None

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


from typing import List, Optional

class Event(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    location: str
    date: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class EventResponse(BaseModel):
    name:str
    description:str
    location:str
    date:str
    image_url: Optional[str] = None

    class Config:
        from_attributes=True
