from sqlalchemy.orm import Session
from .. import schema, database, models
from fastapi import HTTPException

get_db=database.get_db




def get_all(db: Session):
    events = db.query(models.Event).all()
    return events


def create_event(request: schema.Event, db:Session, current_user_id: int):
    new_event = models.Event(
                name=request.name,
                description=request.description,
                date=request.date,
                location=request.location,
                image_url=request.image_url,
                user_id=current_user_id
            )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


def get_event_by_id(id: int, db: Session):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


def delete_event(id: int, db: Session):
    event = db.query(models.Event).filter(models.Event.id == id)
    if not event.first():
        raise HTTPException(status_code=404, detail="Event not found")
    event.delete(synchronize_session=False)
    db.commit()
    return "Deleted Successfully"

def update_event(id: int, request: schema.Event, db: Session):
    event = db.query(models.Event).filter(models.Event.id == id)
    if not event.first():
        raise HTTPException(status_code=404, detail="Event not found")
    event.update({
        'name': request.name,
        'description': request.description,
        'date': request.date,
        'location': request.location,
        'image_url': request.image_url
    })
    db.commit()
    return 'Event Updated Successfully'