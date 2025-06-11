import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRouter from "./routes/auth.js";
import complaintRouter from "./routes/complaint.js";
import dashboardRouter from './routes/dashboard.js'
import citiesRouter from './routes/cities.js'
import categoryRouter from './routes/categories.js'
import departmentRouter from './routes/departments.js'
import workersRouter from './routes/workers.js'
import resolutionRouter from './routes/resolution_log.js'

app.use("/auth", authRouter);
app.use("/complaint", complaintRouter);
app.use('/dashboard',dashboardRouter);
app.use('/cities',citiesRouter)
app.use('/categories',categoryRouter)
app.use('/departments',departmentRouter)
app.use('/workers',workersRouter);
app.use('/resolution',resolutionRouter)


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
