from fastapi import APIRouter, Depends ,Response,status,HTTPException,Request
from sqlalchemy.orm import Session
from .. import schema, database, models,oauth, token

from typing import List
from ..repo import blog

get_db=database.get_db


router=APIRouter(
    tags=['BLOG'],
    prefix='/blog'
)


@router.get('/',)
def show_all(db:Session=Depends(get_db),current_user:schema.UserResponse=Depends(oauth.get_current_user)):
    return blog.get_all(db)


@router.post("/", status_code=201, )
def create(request: schema.Blog, db: Session = Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
    return blog.create_blog(request, db, current_user)


@router.get('/{id}', status_code=200, response_model=schema.BlogResponse)
def show(id,response:Response,db:Session=Depends(get_db)):
    return blog.get_blog_by_id(id,db)

@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id,db:Session=Depends(database.get_db)):
   return blog.delete_blog(id,db)


@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED,)
def update(id,request:schema.Blog,db:Session=Depends(get_db)):
   return blog.update_blog(id,request,db)

