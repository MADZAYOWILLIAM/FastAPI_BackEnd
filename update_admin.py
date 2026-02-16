from sqlalchemy.orm import Session
from blog import models, database, hashing

db = next(database.get_db())

# Create admin@gmail.com
email = 'admin@gmail.com'
password = 'admin@william'
hashed_password = hashing.hash_password(password)

existing_user = db.query(models.User).filter(models.User.email == email).first()

if existing_user:
    existing_user.role = 'admin'
    existing_user.password = hashed_password
    print(f"Updated existing user {email} to admin role.")
else:
    new_user = models.User(
        name="System Admin",
        email=email,
        password=hashed_password,
        role='admin',
        phone_number='0700000000'
    )
    db.add(new_user)
    print(f"Created new admin user: {email}")

db.commit()
print("Operation successful!")
