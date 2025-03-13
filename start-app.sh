#!/bin/bash

# Stop and remove existing containers
docker-compose down

# Start new containers in detached mode
docker-compose up -d

# Start Supabase
npx supabase start
