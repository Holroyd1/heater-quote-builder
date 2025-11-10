// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create the Express app
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Example API endpoint
app.post("/calculate", (req, res) => {
  const { voltage, area, resistance } = req.body;

  // Example calculation
  const watts = (voltage * voltage) / resistance;

  // Send the result back as JSON
  res.json({
    watts,
    area,
    resistance,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
