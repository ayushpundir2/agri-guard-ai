import sys
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.services.seed_service import seed_database
import app.models # register models

def init_and_seed():
    print("Ensuring PostGIS extension is enabled...")
    with engine.connect() as conn:
        try:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            conn.commit()
            print("PostGIS extension enabled.")
        except Exception as e:
            print(f"Notice: PostGIS extension check: {e}")

    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("Seeding Pune prototype food system data...")
        seed_database(db, num_parcels=75)
        print("Seeding complete.")
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed()
