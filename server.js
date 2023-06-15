const inquirer = require("inquirer");
const db = require("./config/connection");
const mysql = require('mysql2');
const { connect } = require("./config/connection");
const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Shows all departments
async function displayDepartments() {
    const [ departments ] = await db.promise().query("SELECT name AS Department, department.id FROM department")
    console.table(departments)
    handleOptions();
}

// Shows all Roles
async function displayRoles() {
    const [ roles ] = await db.promise().query("SELECT title AS Role, department.id, salary AS Salary, department.name AS Department FROM role LEFT JOIN department on role.department_id = department.id")
    console.table(roles)
    handleOptions();
}

// Shows all Employees
async function displayEmployees() {
    const [ employees ] = await db.promise().query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, employee.role_id, role.title, role.department_id, department.name AS department, role.salary, employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id")
    console.table(employees)
    handleOptions();
}

// Function to show list of options user could choose from
async function handleOptions() {
    const options = [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role'
    ]

    // First user prompt to ask user to choose from the list of options
    const results = await inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'command',
        type: 'list',
        choices: options,
    }]);
    
    if (results.command == 'View All Departments') {
        displayDepartments();
    } else if (results.command == 'View All Roles') {
        displayRoles();
    } else if (results.command == 'View All Employees') {
        displayEmployees();
    } else if (results.command == 'Add a Department') {
        addDepartment();
    } else if (results.command == 'Add a Role') {
        addRole();
    } else if (results.command == 'Add an Employee') {
        addEmployee();
    } else if (results.command == 'Update an Employee Role') {
        updateEmployee();
    };
};

// Function to add department
async function addDepartment() {
    const name = await inquirer.prompt([
        {type: "input",
        name: "name",
        message: "enter name of new department"}
    ])
    const sql = "INSERT INTO department SET ?";
    connection.query(sql, name, (err, result) => {
        if (err) throw err;
        console.log("Department has been added!");
        displayDepartments()
    })
}

// Function to add a role
async function addRole() {
    const [ departments ] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(({id, name}) => ({name: name, value:id}))
    const { title, salary, department_id } = await inquirer.prompt([
        {type: "input",
        name: "title",
        message: "enter the name of new role"},
        {type: "number",
        name: "salary",
        message: "enter the salary of new role"},
        {type: "list",
        name: "department_id",
        choices: departmentArray,
        message: "select the department of this role"}
    ])

    const sql = "INSERT INTO role SET ?";
    const roleObj = { title, salary, department_id }

    connection.query(sql, roleObj, (err, result) => {
      if (err) throw err;
    console.log("Role has been added!");
    displayRoles()
    }) 
}

// Function to add employee
async function addEmployee() {
    const [ roles ] = await db.promise().query("SELECT * FROM role")
    const roleArray = roles.map(({id, title}) => ({name: title, value:id}))
    const managerId = roleArray.filter(role => role.name === "Manager")[0].value
    const [ manager ] = await db.promise().query("SELECT * FROM employee WHERE role_id = ?", managerId)
    const managerArray = manager.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value:id}))
    const {role_id, first_name, last_name, manager_id } = await inquirer.prompt([
        {type: "input",
        name: "first_name",
        message: "enter new employee's first name"},
        {type: "input",
        name: "last_name",
        message: "enter new employee's last name"},    
        {type: "list",
        name: "role_id",
        choices: roleArray,
        message: "choose employee's role id"},
        {type: "list",
        name: "manager_id",
        choices: managerArray,
        message: "choose employee's manager"
        }
        ])
    
    const sql = "INSERT INTO employee SET ?";
    const employeeObj = { role_id, first_name, last_name, manager_id }

    connection.query(sql, employeeObj, (err, result) => {
      if (err) throw err;
    console.log("Employee has been added!");
    displayEmployees()
})
}

// Function to update employee
async function updateEmployee() {
    const [ roles ] = await db.promise().query("SELECT * FROM role")
    const roleArray = roles.map(({id, title}) => ({name: title, value:id}))
    const [ employees ] = await db.promise().query("SELECT * FROM employee")
    const employeeArray = employees.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value:id}))
    let employeeId 
    await inquirer.prompt([
        {type: "list",
        name: "id",
        choices: employeeArray,
        message: "choose which employee you wish to update"
        },
        {type: "list",
        name: "role_title",
        choices: roleArray,
        message: "what role is the employee changing to",
        }
    ]).then(response => {
        employeeId = response.id
    const sql = `UPDATE employee SET role_id = ? WHERE id = ${employeeId}`;
    connection.query(sql, response.role_title, (err, result) => {
      if (err) throw err;
    console.log("Employee has been updated!");
    displayEmployees()
        })
    })
}

handleOptions();