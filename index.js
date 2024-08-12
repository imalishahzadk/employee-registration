const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Path to the JSON data file
const dataPath = path.join(__dirname, "data", "employees.json");

// Function to read data from the JSON file
const readData = () => {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Routes
app.get("/employees", (req, res) => {
  try {
    res.json(readData());
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.post("/employees", (req, res) => {
  try {
    const employees = readData();
    const newEmployee = req.body;
    employees.push(newEmployee);
    writeData(employees);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

app.put("/employees/:id", (req, res) => {
  try {
    const employees = readData();
    const { id } = req.params;
    const updatedEmployee = req.body;
    const index = employees.findIndex((emp) => emp.empId === parseInt(id));

    if (index !== -1) {
      employees[index] = updatedEmployee;
      writeData(employees);
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
});

app.delete("/employees/:id", (req, res) => {
  try {
    const employees = readData();
    const { id } = req.params;
    const index = employees.findIndex((emp) => emp.empId === parseInt(id));

    if (index !== -1) {
      employees.splice(index, 1);
      writeData(employees);
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
