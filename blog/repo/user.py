from sqlalchemy.orm import Session
from .. import schema, database, models
from typing import List
from ..hashing import hash_password
from fastapi import HTTPException ,Depends

def get_all(db: Session):
    users=db.query(models.User).all()
    return users

def create_user(request: schema.User, db: Session=Depends(database.get_db)):
    hashed_password = hash_password(request.password)
    
    new_user=models.User(name=request.name,
        email=request.email,password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_id(id: int, db: Session=Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.id==id).first()
    if not user:
          raise HTTPException(status_code=404, detail="User not found")
        
    return user


def delete_user(id: int, db: Session=Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.id==id)
    if not user:
        raise HTTPException(status_code=404, detail="Blog not found")
    user.delete(synchronize_session=False)
    db.commit()

    return {'done'}

def update_user(id: int, request: schema.User, db: Session=Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.id==id)
    if not user:
        raise HTTPException(status_code=404, detail="Blog not found")
    user.update(request.dict())
    db.commit()

    return {'Done'}

