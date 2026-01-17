from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel

app=FastAPI()


@app.get('/blog')
def index (limit=10,published:bool=True,sort:Optional[str]=None):
    if published:
        return {'data':f'{limit} published blogs from the db'}
    return {'data':f'{limit} blogs from the db'}

@app.get('/blog/unpublished')
def unpublished():
    return {'data':'all Unpublished blogs'}


@app.get('/blog/{id}')
def show(id:int):
    return {'data':id}

class Blog(BaseModel):
    title:str
    body:str
    published:Optional[bool]


@app.get('/blog/{id}/comments')
def comments(id,limit=10):
    return {'data':{'1','2'}}


@app.post('/blog')
def create(request:Blog):
    return {'data':f"New Blog Is Created with {request.title}"}
