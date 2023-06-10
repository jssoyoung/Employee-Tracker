const inquirer = require("inquirer");
const db = require("./config/connection");

async function displayDepartments() {
    const [ departments ] = await db.promise().query("SELECT name AS Department FROM department")
    console.table(departments)
    handleOptions();
}

async function displayRoles() {
    const [ roles ] = await db.promise().query("SELECT title AS Role, salary AS Salary, department.name AS Department FROM role LEFT JOIN department on role.department_id = department.id;")
    console.table(roles)
    handleOptions();
}

async function displayEmployees() {
    const [ employees ] = await db.promise().query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee")
    console.table(employees)
    handleOptions();
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

    };
};

async function addDepartment() {
    const [ departments ] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(({id, name}) => ({name: name, value:id}))
    const { title, salary, department_id } = await inquirer.prompt([
        {type: "input",
        name: "title",
        message: "enter employees role"},
        {type: "number",
        name: "salary",
        message: "enter employees salary"},
        {type: "list",
        name: "department_id",
        choices: departmentArray,
        message: "select employees department"}
    ])
    const roleObj = { title, salary, department_id }
    db.promise().query("INSERT INTO role SET ?", roleObj).then(response => {
        if(response.affectedRows >0) {
        displayRoles() 
        } else { 
            console.error("Failed to add role")
            handleOptions()
        }
    }) 
}

async function addRole() {
    const [ departments ] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(({id, name}) => ({name: name, value:id}))
    const { title, salary, department_id } = await inquirer.prompt([
        {type: "input",
        name: "title",
        message: "enter employees role"},
        {type: "number",
        name: "salary",
        message: "enter employees salary"},
        {type: "list",
        name: "department_id",
        choices: departmentArray,
        message: "select employees department"}
    ])
    const roleObj = { title, salary, department_id }
    db.promise().query("INSERT INTO role SET ?", roleObj).then(response => {
        if(response.affectedRows >0) {
        displayRoles() 
        } else { 
            console.error("Failed to add role")
            handleOptions()
        }
    }) 
}

async function addEmployee() {
    const [ departments ] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(({id, name}) => ({name: name, value:id}))
    const { title, salary, department_id } = await inquirer.prompt([
        {type: "input",
        name: "title",
        message: "enter employees role"},
        {type: "number",
        name: "salary",
        message: "enter employees salary"},
        {type: "list",
        name: "department_id",
        choices: departmentArray,
        message: "select employees department"}
    ])
    const roleObj = { title, salary, department_id }
    db.promise().query("INSERT INTO role SET ?", roleObj).then(response => {
        if(response.affectedRows >0) {
        displayRoles() 
        } else { 
            console.error("Failed to add role")
            handleOptions()
        }
    }) 
}

handleOptions();