import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"; // Import mongoose
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config(); // Load environment variables from .env file (if using)

const port = process.env.PORT || 3000;

// CORS Configuration (Important!)
const corsOptions = {
  origin: "http://localhost:5173", // Or an array of allowed origins
  credentials: true, // Important if using cookies (remove if not)
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connection (Crucial!)
const uri = process.env.MONGO_URI; // Get URI from environment variable
console.log("Connecting to MongoDB with URI:", uri); // Log the URI (REMOVE IN PRODUCTION)

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails (important!)
  });

app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

app.get("/", (req, res) => {
  res.send("hello world!");
});

// Global Error Handler (Improved)
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ error: message, details: err.stack }); // Include stack trace for debugging (REMOVE IN PRODUCTION)
});

app.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}`);
});
