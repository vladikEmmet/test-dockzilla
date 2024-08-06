CREATE TABLE Task_entity (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    shortDesc TEXT,
    fullDesc TEXT,
    date TIMESTAMPTZ NOT NULL,
    status BOOLEAN NOT NULL
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO Task_entity (id, name, shortDesc, fullDesc, date, status) VALUES
    (gen_random_uuid(), 'Task 1', 'Short description 1', 'Full description 1', NOW(), TRUE),
    (gen_random_uuid(), 'Task 2', 'Short description 2', 'Full description 2', NOW(), FALSE),
    (gen_random_uuid(), 'Task 3', 'Short description 3', 'Full description 3', NOW(), TRUE),
    (gen_random_uuid(), 'Task 4', 'Short description 4', 'Full description 4', NOW(), FALSE),
    (gen_random_uuid(), 'Task 5', 'Short description 5', 'Full description 5', NOW(), TRUE),
    (gen_random_uuid(), 'Task 6', 'Short description 6', 'Full description 6', NOW(), FALSE),
    (gen_random_uuid(), 'Task 7', 'Short description 7', 'Full description 7', NOW(), TRUE),
    (gen_random_uuid(), 'Task 8', 'Short description 8', 'Full description 8', NOW(), FALSE),
    (gen_random_uuid(), 'Task 9', 'Short description 9', 'Full description 9', NOW(), TRUE),
    (gen_random_uuid(), 'Task 10', 'Short description 10', 'Full description 10', NOW(), FALSE),
    (gen_random_uuid(), 'Task 11', 'Short description 11', 'Full description 11', NOW(), TRUE),
    (gen_random_uuid(), 'Task 12', 'Short description 12', 'Full description 12', NOW(), FALSE),
    (gen_random_uuid(), 'Task 13', 'Short description 13', 'Full description 13', NOW(), TRUE),
    (gen_random_uuid(), 'Task 14', 'Short description 14', 'Full description 14', NOW(), FALSE),
    (gen_random_uuid(), 'Task 15', 'Short description 15', 'Full description 15', NOW(), TRUE),
    (gen_random_uuid(), 'Task 16', 'Short description 16', 'Full description 16', NOW(), FALSE),
    (gen_random_uuid(), 'Task 17', 'Short description 17', 'Full description 17', NOW(), TRUE),
    (gen_random_uuid(), 'Task 18', 'Short description 18', 'Full description 18', NOW(), FALSE),
    (gen_random_uuid(), 'Task 19', 'Short description 19', 'Full description 19', NOW(), TRUE),
    (gen_random_uuid(), 'Task 20', 'Short description 20', 'Full description 20', NOW(), FALSE);

INSERT INTO Task_entity (id, name, shortDesc, fullDesc, date, status) VALUES
    (gen_random_uuid(), 'Task 21', 'Short description 21', 'Full description 21', NOW(), FALSE);
