import cors from 'cors';
import 'dotenv/config';
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import administratorRouter from "./routes/administratorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import studentRouter from "./routes/studentRoute.js";
import teacherRouter from './routes/teacherRoute.js';
import userRouter from "./routes/userRoute.js";
import utilityRouter from './routes/utilityRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// CORS configuration
const corsOptions = {
  origin: 'https://scc-ams--three.vercel.app', // Your frontend domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Middleware for handling preflight requests explicitly (can be omitted as `cors` already handles it)
app.options('*', cors(corsOptions));

// middlewares
app.use(express.json());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/administrator", administratorRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/utility", utilityRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
