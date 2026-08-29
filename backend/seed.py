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
        print(f"PostGIS extension warning: {e}")

    print("Re-creating fresh database tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Table creation error: {e}")
        raise e

    db = SessionLocal()
    try:
        print("Seeding Pune prototype food system data...")
        seed_database(db, num_parcels=75)
        print("Seeding complete.")
    except Exception as e:
        print(f"Seeding error: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed()
