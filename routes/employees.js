const fs = require("fs");
const path = require("path");

// Path to the JSON data file
const dataPath = path.join(__dirname, "../data", "employees.json");

// Function to read data from the JSON file
const readData = () => {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// API handler
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins, adjust this for security
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight requests
    res.status(204).end();
    return;
  }

  switch (req.method) {
    case "GET":
      try {
        res.status(200).json(readData());
      } catch (error) {
        res.status(500).json({ error: "Failed to read data" });
      }
      break;
    case "POST":
      try {
        const employees = readData();
        const newEmployee = req.body;
        employees.push(newEmployee);
        writeData(employees);
        res.status(201).json(newEmployee);
      } catch (error) {
        res.status(500).json({ error: "Failed to add employee" });
      }
      break;
    case "PUT":
      try {
        const employees = readData();
        const { id } = req.query;
        const updatedEmployee = req.body;
        const index = employees.findIndex((emp) => emp.empId === parseInt(id));

        if (index !== -1) {
          employees[index] = updatedEmployee;
          writeData(employees);
          res.status(200).json(updatedEmployee);
        } else {
          res.status(404).json({ error: "Employee not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to update employee" });
      }
      break;
    case "DELETE":
      try {
        const employees = readData();
        const { id } = req.query;
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
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
