import express from "express";
import { connectDB } from "./db/db.js";
import { PORT } from "./constants.js";
import cors from "cors";
import { limiter } from "./middleware/rateLimiter.middleware.js";
import errorhandler from "./middleware/errorHandler.middleware.js";
import router from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3001",
        "http://localhost:5173",
        "https://darulhuda-dashboard.vercel.app",
        "https://darul-huda.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(limiter);

app.use("/api", router);

app.use(errorhandler);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Darul Huda Backend is running ✅" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
