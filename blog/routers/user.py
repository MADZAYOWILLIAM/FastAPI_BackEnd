from fastapi import APIRouter, Depends,status,HTTPException
from sqlalchemy.orm import Session
from .. import schema, database, models
from typing import List
from ..hashing import hash_password
from  ..repo import user
get_db=database.get_db

router=APIRouter(
    prefix='/user',
    tags=["USER"]
)







@router.post('/',response_model=schema.UserResponse)
def create_user(request:schema.User,db:Session=Depends(get_db)):
   return user.create_user(request,db)

@router.get('/',response_model=List[schema.UserResponse])
def show_user(db:Session=Depends(get_db)):
   return user.get_all(db)


@router.get('/{id}',response_model=schema.UserResponse)
def show(id,db:Session=Depends(get_db)):
    return user.get_user_by_id(id,db)


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id,db:Session=Depends(get_db)):
   return user.delete_user(id,db)

@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_user(id,request:schema.User,db:Session=Depends(get_db)):
    return user.update_user(id,request,db)
