INSERT INTO department (name)
VALUES ('Sales'), ('HR'), ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 50000, 2),
       ('Engineer', 60000, 3),
       ('Analyst', 40000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null),
       ('Ashley', 'Price', 2, 1),
       ('Bob', 'Smith', 3, 1);