#!/bin/sh

# Load environment variables
. ./.env

# Create the database if it doesn't exist
psql -U $POSTGRES_USER -h $POSTGRES_HOST -c "CREATE DATABASE $POSTGRES_DATABASE;" || true
