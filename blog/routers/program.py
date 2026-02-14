from fastapi import APIRouter, Depends,status,HTTPException
from sqlalchemy.orm import Session
from .. import schema, database, oauth
from typing import List

from  ..repo import program
get_db=database.get_db

router=APIRouter(
    prefix='/programs',
    tags=["PROGRAMS"]
)


@router.post('/',response_model=schema.ProgramResponse)
def create_program(request:schema.Program,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return program.create_program(request,db,current_user)

@router.get('/',response_model=List[schema.ProgramResponse])
def show_programs(db:Session=Depends(get_db)):
   return program.show_programs(db)


@router.get('/{id}',response_model=schema.ProgramResponse)
def show(id,db:Session=Depends(get_db)):
    return program.get_program_by_id(id,db)


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def deleate_program(id,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return program.delete_program(id,db)

@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_program(id,request:schema.Program,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
    return program.update_program(id,request,db)
