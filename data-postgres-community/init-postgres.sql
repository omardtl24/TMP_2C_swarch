-- Step 1: Create the database
CREATE DATABASE devpc;

-- Step 2: Connect to the devp database
\c devpc;

-- Step 3: Create tables

-- Event table
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    creator_id INT NOT NULL,
    begin_date DATE NOT NULL,
    end_date DATE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    invitation_enabled BOOLEAN DEFAULT FALSE
    --FOREIGN KEY (creator_id) REFERENCES Users(user_id)
);

-- Expenses table
CREATE TABLE Expenses (
    expense_id SERIAL PRIMARY KEY,
    external_doc_id VARCHAR(100),
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

-- Event participation (many-to-many between User and Event)
CREATE TABLE EventParticipation (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    --PRIMARY KEY (user_id, event_id),
    --FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);