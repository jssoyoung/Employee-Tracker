const inquirer = require("inquirer");
const mysql = require('mysql2');

// TODO connect to mysql database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "schema"
});
connection.connect();

async function displayDepartments() {
    // TODO implement a function to select all departments from MySQL
}

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
    const results = await inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'command',
        type: 'lists',
        choices: options,
    }]);
    if (results.command == 'View All Departments') {
        displayDepartments();
        handleOptions();
    } else if (results.command == 'View All Roles') {

    }
}

handleOptions();