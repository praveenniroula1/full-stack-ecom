import "dotenv/config";
import express from "express";
import dbConfig from "./SRC/DBConfig/dbConfig.js";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = express();

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ strict: true }));
app.use(compression());
app.use(limiter);
app.use("/photos", express.static("upload", { maxAge: "1d" })); // Set caching headers

// Initialize database
dbConfig();

// Routes
import userRouter from "../api/SRC/Routers/userRouter.js"
import productRouter from "../api/SRC/Routers/productRouter.js"
import categoryRouter from "../api/SRC/Routers/categoryRouter.js"
import cartRouter from "../api/SRC/Routers/cartRouter.js"
import checkoutRouter from "../api/SRC/Routers/checkoutRouter.js"
import orderRouter from "../api/SRC/Routers/orderRouter.js"
// import webHook from "../api/SRC/Routers/webHook.js"
app.use("/api/v1/user",  userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/orders", orderRouter);
// app.use("/webhook", webHook);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
