from sqlalchemy.orm import Session
from .. import schema, database, models
from typing import List
from fastapi import HTTPException ,Depends

get_db=database.get_db


def create_program(request:schema.Program, db:Session=Depends(get_db), current_user: schema.UserResponse | None = None):
    new_program=models.Program(
        name=request.name,
        description=request.description,
        start_date=request.start_date,
        end_date=request.end_date,
        image_url=request.image_url,
        user_id=current_user.id if current_user else None
    )
    db.add(new_program)
    db.commit()
    db.refresh(new_program)
    return new_program



def show_programs(db:Session=Depends(get_db)):
    programs=db.query(models.Program).all()
    return programs


def get_program_by_id(id:int, db:Session=Depends(get_db)):
    program=db.query(models.Program).filter(models.Program.id==id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program


def update_program(id:int, request:schema.Program, db:Session=Depends(get_db)):
    program=db.query(models.Program).filter(models.Program.id==id)
    if not program.first():
        raise HTTPException(status_code=404, detail="Program not found")
    # prevent user_id from being overwritten from client input
    update_data = request.dict()
    update_data.pop('user_id', None)
    program.update(update_data)
    db.commit()
    return "Updateed successfully"

def delete_program(id:int, db:Session=Depends(get_db)):
    program=db.query(models.Program).filter(models.Program.id==id)
    if not program.first():
        raise HTTPException(status_code=404, detail="Program not found")
    program.delete(synchronize_session=False)
    db.commit()
    return "Deleted successfully"