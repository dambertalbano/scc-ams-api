import cors from 'cors'
import 'dotenv/config'
import express from "express"
import connectCloudinary from "./config/cloudinary.js"
import connectDB from "./config/mongodb.js"
import administratorRouter from "./routes/administratorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import studentRouter from "./routes/studentRoute.js"
import teacherRouter from './routes/teacherRoute.js'
import userRouter from "./routes/userRoute.js"
import utilityRouter from './routes/utilityRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
  origin: 'https://scc-ams--three.vercel.app', // Your frontend domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.options('*', cors({
  origin: 'https://scc-ams--three.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://scc-ams--three.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  next();
});



// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/student", studentRouter)
app.use("/api/administrator", administratorRouter)
app.use("/api/teacher", teacherRouter)
app.use("/api/utility", utilityRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))