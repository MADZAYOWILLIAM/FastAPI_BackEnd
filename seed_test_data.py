from sqlalchemy.orm import Session
from blog import models, database, hashing

db = next(database.get_db())

# Get a user (e.g., the admin)
user = db.query(models.User).filter(models.User.email == 'williamsmadzayo@gmail.com').first()
if not user:
    # Create if doesn't exist (fallback)
    hashed = hashing.hash_password('admin@william')
    user = models.User(name="Admin William", email="williamsmadzayo@gmail.com", password=hashed, role="admin", phone_number="0700000000")
    db.add(user)
    db.commit()
    db.refresh(user)

# Add a Program
if not db.query(models.Program).first():
    p = models.Program(
        name="Leadership Excellence",
        description="Master the art of leadership and organizational management.",
        start_date="2026-03-01",
        end_date="2026-06-01",
        image_url="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800",
        user_id=user.id
    )
    db.add(p)

# Add a Service
if not db.query(models.Service).first():
    s = models.Service(
        name="1:1 Executive Coaching",
        description="Personalized coaching for senior executives.",
        price=150.00,
        image_url="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800"
    )
    db.add(s)

# Add a Blog (News)
if not db.query(models.Blog).first():
    b = models.Blog(
        title="Scaling Your Business in 2026",
        body="Learn the latest strategies for sustainable growth and digital transformation.",
        image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800",
        user_id=user.id
    )
    db.add(b)

# Add an Event
if not db.query(models.Event).first():
    e = models.Event(
        name="Annual Growth Summit",
        description="Gather with industry leaders for a day of networking and insights.",
        date="2026-05-15",
        location="Empoweredge Headquarters",
        image_url="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800",
        user_id=user.id
    )
    db.add(e)

db.commit()
print("Data seeded successfully!")
