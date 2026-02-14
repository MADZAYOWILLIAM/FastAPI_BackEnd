from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session
from .. import schema, database, oauth
from typing import List

from  ..repo import service
get_db=database.get_db



router=APIRouter(
    prefix='/services',
    tags=["SERVICES"]
)

@router.get('/',response_model=List[schema.ServiceResponse])
def show_services(db:Session=Depends(get_db)):
   return service.get_all(db)

@router.post('/',response_model=schema.ServiceResponse)
def create_service(request:schema.ServiceCreate,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return service.create_service(request,db)


@router.get('/{id}',response_model=schema.ServiceResponse)
def show(id,db:Session=Depends(get_db)):
    return service.get_service_by_id(id,db)


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def deleate_service(id,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
   return service.delete_service(id,db)



@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_service(id,request:schema.Service,db:Session=Depends(get_db), current_user: schema.UserResponse = Depends(oauth.get_current_user)):
    return service.update_service(id,request,db)