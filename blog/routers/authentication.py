from fastapi import APIRouter,Depends,HTTPException,status
from .. import schema,database,models
from sqlalchemy.orm import Session
from ..hashing import hash_password,verify_password
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .. import token

router=APIRouter(
    tags=["Authentication"]
)



@router.post('/login')
def login(request:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.email==request.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Credentials, Please Try Again")

    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=404, detail="Invalid Credentials, Please Try Again")


    return {"access_token":token.create_access_token(data={"sub":user.email}),
            "token_type":"bearer"
            }