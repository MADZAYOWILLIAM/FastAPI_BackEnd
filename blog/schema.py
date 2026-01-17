from pydantic import BaseModel
from typing import List

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class BlogCreate(BaseModel):
    title: str
    body: str


class BlogResponse(BaseModel):
    id: int
    title: str
    body: str
    owner: UserResponse   # 👈 USER INCLUDED

    class Config:
        from_attributes = True
