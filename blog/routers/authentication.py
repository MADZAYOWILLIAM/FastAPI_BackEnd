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
            "token_type":"bearer",
            "role": user.role
            }


@router.post('/register', status_code=status.HTTP_201_CREATED)
def register(request: schema.User, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(request.password)
    new_user = models.User(name=request.name, email=request.email, password=hashed, phone_number=request.phone_number)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Auto-login behavior: return the same response as /login
    access_token = token.create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "message": "Registered successfully. Use this token or POST to /login.",
        "login_url": "/login",
    }