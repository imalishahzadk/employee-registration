const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to your JSON file
const dataPath = path.join(__dirname, "data", "employees.json");

const readData = () => {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath));
  }
  return [];
};

app.get("/employees", (req, res) => {
  res.json(readData());
});

app.post("/employees", (req, res) => {
  const employees = readData();
  const newEmployee = req.body;
  employees.push(newEmployee);
  fs.writeFileSync(dataPath, JSON.stringify(employees, null, 2));
  res.status(201).json(newEmployee);
});

app.put("/employees/:id", (req, res) => {
  const employees = readData();
  const index = employees.findIndex(
    (emp) => emp.empId === parseInt(req.params.id)
  );
  if (index !== -1) {
    employees[index] = req.body;
    fs.writeFileSync(dataPath, JSON.stringify(employees, null, 2));
    res.json(employees[index]);
  } else {
    res.status(404).send("Employee not found");
  }
});

app.delete("/employees/:id", (req, res) => {
  const employees = readData();
  const index = employees.findIndex(
    (emp) => emp.empId === parseInt(req.params.id)
  );
  if (index !== -1) {
    employees.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(employees, null, 2));
    res.status(204).send();
  } else {
    res.status(404).send("Employee not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
