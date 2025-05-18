-- Step 1: Create the database
CREATE DATABASE devpp;

-- Step 2: Connect to the devpp database
\c devpp;

-- Step 3: Create tables

-- PersonalExpenses table
CREATE TABLE PersonalExpenses (
    personal_expense_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    concept VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Define if an ENUM or a lookup table exists
    total FLOAT NOT NULL,
    expense_date DATE NOT NULL
    --FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

