import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from app.models import Base
from app.database import DATABASE_URL
from urllib.parse import urlparse

def create_database():
    # Parse the DATABASE_URL to get connection details for the default 'postgres' db
    url = urlparse(DATABASE_URL)
    db_name = url.path[1:]
    user = url.username
    password = url.password
    host = url.hostname
    port = url.port or 5432

    # Connect to default 'postgres' database to create the new database
    try:
        con = psycopg2.connect(
            dbname='postgres',
            user=user,
            host=host,
            password=password,
            port=port
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Creating database {db_name}...")
            cur.execute(f"CREATE DATABASE {db_name}")
            print(f"Database {db_name} created successfully.")
        else:
            print(f"Database {db_name} already exists.")
            
        cur.close()
        con.close()
        
    except Exception as e:
        print(f"Error creating database: {e}")
        # Depending on the error (e.g. auth failed), we might want to stop here
        # But for now we proceed to try table creation which might work if DB existed
        return

def create_tables():
    print("Creating tables...")
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    create_database()
    create_tables()
