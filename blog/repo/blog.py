from sqlalchemy.orm import Session
from .. import schema, database, models
from fastapi import HTTPException

get_db=database.get_db


def get_all(db: Session):
    blogs = db.query(models.Blog).all()
    return blogs



def create_blog(id,request: schema.Blog, db:Session):
    # Getting user from database (assuming user with id=1 exists)
    user = db.query(models.User).filter(models.User.id == id)
   
    new_blog = models.Blog(
                title=request.title,
                body=request.body,
                image_url=request.image_url,
                 owner=user
            )

    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog


def get_blog_by_id(id: int, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

def delete_blog(id: int, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=404, detail="Blog not found")
    blog.delete(synchronize_session=False)
    db.commit()
    return {'done'}


def update_blog(id: int, request: schema.Blog, db: Session):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=404, detail="Blog not found")
    blog.update({
        'title': request.title,
        'body': request.body,
        'image_url': request.image_url
    })
    db.commit()
    return 'Blog Updated Successfully'