
from fastapi import FastAPI, Request
from . import models
from .database import engine, SessionLocal
from .routers import blog, user,authentication,program,service,event



app = FastAPI()



app.include_router(blog.router)
app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(program.router)
app.include_router(service.router)
app.include_router(event.router)


# Create tables
models.Base.metadata.create_all(bind=engine)








