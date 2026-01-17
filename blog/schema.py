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