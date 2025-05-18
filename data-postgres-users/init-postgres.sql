-- Step 1: Create the database
CREATE DATABASE devpu;

-- Step 2: Connect to the devpu database
\c devpu;

-- Step 3: Create tables

-- User table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

