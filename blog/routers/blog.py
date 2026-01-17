from fastapi import APIRouter, Depends ,Response,status,HTTPException
from sqlalchemy.orm import Session
from .. import schema, database, models
from typing import List


router=APIRouter(
    tags=['BLOG'],
    prefix='/blog'
)


@router.get('/',)
def show_all(db:Session=Depends(database.get_db)):
    blogs=db.query(models.Blog).all()
   
    return blogs


@router.post("/", status_code=201, )
def create(request: schema.Blog, db: Session = Depends(database.get_db)):

    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_blog = models.Blog(
        title=request.title,
        body=request.body,
        user_id=user.id
    )

    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog






@router.get('/{id}', status_code=200, response_model=schema.BlogResponse)
def show(id,response:Response,db:Session=Depends(database.get_db)):
    blog=db.query(models.Blog).filter(models.Blog.id==id).first()
    if not blog:
          raise HTTPException(status_code=404, detail="Blog not found")
        
    return blog


@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id,db:Session=Depends(database.get_db)):
    blog=db.query(models.Blog).filter(models.Blog.id==id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog.delete(synchronize_session=False)
    db.commit()

    return {'done'}


@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED,)
def update(id,request:schema.Blog,db:Session=Depends(database.get_db)):
    blog=db.query(models.Blog).filter(models.Blog.id==id)
    if not blog:
         raise HTTPException(status_code=404, detail="Blog not found")
    blog.update(request.dict())
    db.commit()

    return {"Done"}

