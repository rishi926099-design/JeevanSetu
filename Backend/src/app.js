import express from "express";

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("HealthBridge Backend Running...");
});

export default app;