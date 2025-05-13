-- Step 1: Create the database
CREATE DATABASE devp;

-- Step 2: Connect to the devp database
\c devp;

-- Step 3: Create tables

-- User table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- Event table
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    begin_date DATE NOT NULL,
    end_date DATE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    invitation_enabled BOOLEAN DEFAULT FALSE,
    creator_id INT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id)
);

-- Expenses table
CREATE TABLE Expenses (
    expense_id SERIAL PRIMARY KEY,
    external_doc_id VARCHAR(100),
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

-- PersonalExpenses table
CREATE TABLE PersonalExpenses (
    personal_expense_id SERIAL PRIMARY KEY,
    concept VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Define if an ENUM or a lookup table exists
    total FLOAT NOT NULL,
    expense_date DATE NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Event participation (many-to-many between User and Event)
CREATE TABLE EventParticipation (
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);
