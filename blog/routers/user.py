from fastapi import APIRouter, Depends ,Response,status,HTTPException
from sqlalchemy.orm import Session
from .. import schema, database, models
from typing import List
from ..hashing import hash_password

get_db=database.get_db

router=APIRouter(
    prefix='/user',
    tags=["USER"]
)







@router.post('/',response_model=schema.UserResponse)
def create_user(request:schema.User,db:Session=Depends(get_db)):
    hashed_password = hash_password(request.password)
    
    new_user=models.User(name=request.name,
        email=request.email,password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get('/',response_model=List[schema.UserResponse])
def show_user(db:Session=Depends(get_db)):
    users=db.query(models.User).all()
    return users


@router.get('/{id}',response_model=schema.UserResponse)
def show(id,db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.id==id).first()
    if not user:
          raise HTTPException(status_code=404, detail="User not found")
        
    return user


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_user(id,db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.id==id)
    if not user:
        raise HTTPException(status_code=404, detail="Blog not found")
    user.delete(synchronize_session=False)
    db.commit()

    return {'done'}

@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_user(id,request:schema.User,db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.id==id)
    if not user:
        raise HTTPException(status_code=404, detail="Blog not found")
    user.update(request.dict())
    db.commit()

    return {'Done'}
