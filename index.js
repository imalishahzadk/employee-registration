const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Path to JSON file
const dataFilePath = path.join(__dirname, "data", "employees.json");

// Helper function to read JSON data
const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
};

// Helper function to write JSON data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get all employees
app.get("/employees", (req, res) => {
  const employees = readData();
  res.json(employees);
});

// Get employee by ID
app.get("/employees/:id", (req, res) => {
  const employees = readData();
  const employee = employees.find(
    (emp) => emp.empId === parseInt(req.params.id)
  );
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send("Employee not found");
  }
});

// Add new employee
app.post("/employees", (req, res) => {
  const employees = readData();
  const newEmployee = req.body;
  newEmployee.empId = employees.length
    ? employees[employees.length - 1].empId + 1
    : 1;
  employees.push(newEmployee);
  writeData(employees);
  res.status(201).json(newEmployee);
});

// Update employee
app.put("/employees/:id", (req, res) => {
  const employees = readData();
  const index = employees.findIndex(
    (emp) => emp.empId === parseInt(req.params.id)
  );
  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body };
    writeData(employees);
    res.json(employees[index]);
  } else {
    res.status(404).send("Employee not found");
  }
});

// Delete employee
app.delete("/employees/:id", (req, res) => {
  const employees = readData();
  const updatedEmployees = employees.filter(
    (emp) => emp.empId !== parseInt(req.params.id)
  );
  if (employees.length === updatedEmployees.length) {
    return res.status(404).send("Employee not found");
  }
  writeData(updatedEmployees);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
