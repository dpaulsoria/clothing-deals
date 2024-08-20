-- Habilitar extensiones PostGIS y PostGIS Topology
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- User
CREATE TABLE "GPG_USER" (
  id serial PRIMARY KEY,
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  isAdmin int NOT NULL,
  isActive int NOT NULL,
  avatarUrl varchar(255) default null,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Shapefile
CREATE TABLE "GPG_SHAPEFILE" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  geometry geometry NOT NULL,
  properties jsonb,
  user_id INT NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- Statistics
CREATE TABLE "GPG_STATISTICS" (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Estadistica',
  user_id int NOT NULL,
  timeline_init timestamp NOT NULL,
  timeline_finish timestamp NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE,
  FOREIGN KEY (shapefile_id) REFERENCES "GPG_SHAPEFILE"(id) ON DELETE CASCADE
);

-- Relacion Polimorfica intermedia
CREATE TABLE "GPG_STATS_SHAPEFILE" (
  id SERIAL PRIMARY KEY,
  statistics_id INTEGER REFERENCES "GPG_STATISTICS"(id) ON DELETE CASCADE,
  shapefile_id INTEGER REFERENCES "GPG_SHAPEFILE"(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
);

-- Iguana (marker)
CREATE TABLE "GPG_IGUANA" (
  id serial PRIMARY KEY,
  user_id int NOT NULL,
  sexo int NOT NULL DEFAULT 0,
  point geometry(Point, 4326) NOT NULL,
  register_date timestamp NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- Workspace
CREATE TABLE "GPG_WORKSPACE" (
  id serial PRIMARY KEY,
  user_id int NOT NULL,
  name varchar(255) NOT NULL,
  description text NOT NULL,
  state int NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- State
CREATE TABLE "GPG_STATE" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- StateIguana
CREATE TABLE "GPG_STATE_IGUANA" (
  id serial PRIMARY KEY,
  iguana_id int NOT NULL,
  state_id int NOT NULL,
  FOREIGN KEY (iguana_id) REFERENCES "GPG_IGUANA"(id) ON DELETE CASCADE,
  FOREIGN KEY (state_id) REFERENCES "GPG_STATE"(id) ON DELETE CASCADE
);

-- AgeClassification
CREATE TABLE "GPG_AGE_CLASSIFICATION" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- AgeClassIguana
CREATE TABLE "GPG_AGE_CLASS_IGUANA" (
  id serial PRIMARY KEY,
  iguana_id int NOT NULL,
  age_class_id int NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (iguana_id) REFERENCES "GPG_IGUANA"(id) ON DELETE CASCADE,
  FOREIGN KEY (age_class_id) REFERENCES "GPG_AGE_CLASSIFICATION"(id) ON DELETE CASCADE
);

-- Shape Index File
CREATE TABLE "GPG_SHAPEINDEX" (
  id serial PRIMARY KEY,
  feature_id int NOT NULL,
  geom_offset int NOT NULL,
  content_length int NOT NULL,
  user_id INT NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- Rasters
CREATE TABLE "GPG_RASTERS" (
  id serial PRIMARY KEY,
  file_name varchar(255) NOT NULL,
  file_path varchar(1024) NOT NULL,
  file_size bigint NOT NULL,
  description text NOT NULL,
  user_id INT NOT NULL,
  geom geometry default null,
  srid int NOT NULL,
  raster_type varchar(50) NOT NULL,
  is_global boolean DEFAULT false,
  upload_date timestamp DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- Shaders
CREATE TABLE "GPG_SHADERS" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  configuration text NOT NULL,
  user_id INT NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- File Type
CREATE TABLE "GPG_FILETYPE" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  extension varchar(50) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Files
CREATE TABLE "GPG_WORKSPACE_FILES" (
  id serial PRIMARY KEY,
  workspace_id int NOT NULL,
  file_id int NOT NULL,
  filetype_id int NOT NULL,
  FOREIGN KEY (workspace_id) REFERENCES "GPG_WORKSPACE"(id) ON DELETE CASCADE,
  FOREIGN KEY (filetype_id) REFERENCES "GPG_FILETYPE"(id),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Auth type 1 is reset token, type 0 is session
CREATE TABLE "GPG_AUTH" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255),
    type int not null default 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES "GPG_USER"(id) ON DELETE CASCADE
);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Crear triggers para todas las tablas

-- User
CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON "GPG_USER"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Statistics
CREATE TRIGGER update_statistics_updated_at
BEFORE UPDATE ON "GPG_STATISTICS"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Iguana (marker)
CREATE TRIGGER update_iguana_updated_at
BEFORE UPDATE ON "GPG_IGUANA"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Workspace
CREATE TRIGGER update_workspace_updated_at
BEFORE UPDATE ON "GPG_WORKSPACE"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- State
CREATE TRIGGER update_state_updated_at
BEFORE UPDATE ON "GPG_STATE"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- StateIguana
CREATE TRIGGER update_state_iguana_updated_at
BEFORE UPDATE ON "GPG_STATE_IGUANA"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- AgeClassification
CREATE TRIGGER update_age_classification_updated_at
BEFORE UPDATE ON "GPG_AGE_CLASSIFICATION"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- AgeClassIguana
CREATE TRIGGER update_age_class_iguana_updated_at
BEFORE UPDATE ON "GPG_AGE_CLASS_IGUANA"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Shapefile
CREATE TRIGGER update_shapefile_updated_at
BEFORE UPDATE ON "GPG_SHAPEFILE"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Shape Index File
CREATE TRIGGER update_shapeindex_updated_at
BEFORE UPDATE ON "GPG_SHAPEINDEX"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Rasters
CREATE TRIGGER update_rasters_updated_at
BEFORE UPDATE ON "GPG_RASTERS"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Shaders
CREATE TRIGGER update_shaders_updated_at
BEFORE UPDATE ON "GPG_SHADERS"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Workspace Files
CREATE TRIGGER update_workspace_files_updated_at
BEFORE UPDATE ON "GPG_WORKSPACE_FILES"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- File Type
CREATE TRIGGER update_filetype_updated_at
BEFORE UPDATE ON "GPG_FILETYPE"
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Alter tables

ALTER TABLE public."GPG_STATE_IGUANA"
DROP CONSTRAINT "GPG_STATE_IGUANA_iguana_id_fkey",
ADD CONSTRAINT "GPG_STATE_IGUANA_iguana_id_fkey"
FOREIGN KEY (iguana_id)
REFERENCES public."GPG_IGUANA" (id)
ON DELETE CASCADE;

ALTER TABLE public."GPG_AGE_CLASS_IGUANA"
DROP CONSTRAINT "GPG_AGE_CLASS_IGUANA_iguana_id_fkey",
ADD CONSTRAINT "GPG_AGE_CLASS_IGUANA_iguana_id_fkey"
FOREIGN KEY (iguana_id)
REFERENCES public."GPG_IGUANA" (id)
ON DELETE CASCADE;

-- Drops

DROP TABLE IF EXISTS "GPG_STATE" CASCADE;
DROP TABLE IF EXISTS "GPG_USER" CASCADE;
DROP TABLE IF EXISTS "GPG_STATISTICS" CASCADE;
DROP TABLE IF EXISTS "GPG_WORKSPACE" CASCADE;
DROP TABLE IF EXISTS "GPG_AGE_CLASSIFICATION" CASCADE;
DROP TABLE IF EXISTS "GPG_AGE_CLASS_IGUANA" CASCADE;
DROP TABLE IF EXISTS "GPG_SHAPEFILE" CASCADE;
DROP TABLE IF EXISTS "GPG_SHAPEINDEX" CASCADE;
DROP TABLE IF EXISTS "GPG_RASTERS" CASCADE;
DROP TABLE IF EXISTS "GPG_SHADERS" CASCADE;
DROP TABLE IF EXISTS "GPG_FILETYPE" CASCADE;
DROP TABLE IF EXISTS "GPG_WORKSPACE_FILES" CASCADE;
