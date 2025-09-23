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
app.use(cors());

app.use(limiter);

app.use("/api", router);

app.use(errorhandler);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
