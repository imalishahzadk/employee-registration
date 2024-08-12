const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Route to serve static files if necessary
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/employees", require("./routes/employees"));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
