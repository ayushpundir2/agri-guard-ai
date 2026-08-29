import sys
from sqlalchemy import text
from app.core.database import SessionLocal, engine, Base
from app.services.seed_service import seed_database
import app.models # register models

def init_and_seed():
    print("Ensuring PostGIS extension is enabled...")
    try:
        with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            print("PostGIS extension enabled successfully.")
    except Exception as e:
        print(f"PostGIS extension notice: {e}")

    print("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Table creation notice: {e}")

    db = SessionLocal()
    try:
        print("Seeding Pune prototype food system data...")
        seed_database(db, num_parcels=75)
        print("Seeding complete.")
    except Exception as e:
        print(f"Seeding notice: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed()
