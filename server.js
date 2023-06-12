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
    // TODO Add in job title, department, salaries, and managers
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
        updateEmployee();
    };
};

async function addDepartment() {
    await inquirer.prompt([
        {type: "input",
        name: "name",
        message: "enter name of department"}
    ]).then(data => {
        db.promise().query("INSERT INTO department SET ?", data)
    }).then(displayDepartments()) 
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
    const [ employees ] = await db.promise().query("SELECT * FROM employee")
    const employeesArray = employees.map(({id, name}) => ({name: name, value:id}))
    const {role_id, first_name, last_name, manager_id } = await inquirer.prompt([
        {type: "input",
        name: "role_id",
        message: "enter employees role id"},
        {type: "input",
        name: "first_name",
        message: "enter employees first name"},
        {type: "input",
        name: "last_name",
        message: "enter employees last name"},
        {type: "input",
        name: "manager_id",
        message: "enter manager id"
        }
        ])
    const employeeObj = { role_id, first_name, last_name, manager_id }
    db.promise().query("INSERT INTO employee SET ?", employeeObj).then(response => {
        if(response.affectedRows >0) {
        displayEmployees() 
        } else { 
            console.error("Failed to add employee")
            handleOptions()
        }
    }) 
}

async function updateEmployee() {
    await inquirer.prompt([
        {type: "input",
        name: "employee_id",
        message: "what employee id do you wish to update"
        }
    ]).then(response => {
        let employee_id = response.employee_id
        inquirer.prompt([
            {type: "input",
            name: "role_id",
            message: "what role id is the employee changing to",
            }
    ]).then(response => {
        let role_id = response.role_id
        db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id]).then(handleOptions())
        })
    })
}

handleOptions();