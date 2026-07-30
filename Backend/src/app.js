
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthBridge Backend Running...");
});

export default app;

