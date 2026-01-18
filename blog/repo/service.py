from sqlalchemy.orm import Session
from .. import schema, database, models
from fastapi import HTTPException

get_db=database.get_db


def get_all(db: Session):
    services = db.query(models.Service).all()
    return services


def create_service(request: schema.Service, db:Session):
    new_service = models.Service(
                name=request.name,
                description=request.description,
                price=request.price
            )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


def  get_service_by_id(id: int, db: Session):
    service = db.query(models.Service).filter(models.Service.id == id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


def delete_service(id: int, db: Session):
    service = db.query(models.Service).filter(models.Service.id == id)
    if not service.first():
        raise HTTPException(status_code=404, detail="Service not found")
    service.delete(synchronize_session=False)
    db.commit()
    return "Deleted Successfully"


def update_service(id: int, request: schema.Service, db: Session):
    service = db.query(models.Service).filter(models.Service.id == id)
    if not service.first():
        raise HTTPException(status_code=404, detail="Service not found")
    service.update({
        'name': request.name,
        'description': request.description,
        'price': request.price
    })
    db.commit()
    return 'Service Updated Successfully'