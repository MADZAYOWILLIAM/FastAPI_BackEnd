from fastapi import APIRouter, Depends ,Response,status,HTTPException,Request
from sqlalchemy.orm import Session
from .. import schema, database,oauth, token



from typing import List
from ..repo import event

get_db=database.get_db


router=APIRouter(
    tags=['EVENT'],
    prefix='/event'
)


@router.get('/')
def show_all(db:Session=Depends(get_db)):
    return event.get_all(db)


@router.post('/')
def create(request: schema.Event, db: Session = Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
    return event.create_event(request, db, current_user.id)


@router.get('/{id}', status_code=200, response_model=schema.EventResponse)
def show(id,response:Response,db:Session=Depends(get_db)):
    return event.get_event_by_id(id,db)


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_event(id,db:Session=Depends(database.get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return event.delete_event(id,db)


@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED,)
def update(id,request:schema.Event,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return event.update_event(id,request,db)