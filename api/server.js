import "dotenv/config"
import express from "express";
import dbConfig from "./SRC/DBConfig/dbConfig.js";
import cors from "cors"
const app = express();


// Middleware
app.use(express.json()); 
app.use(cors())

// dbconfig
dbConfig()

// Routes
import userRouter from "../api/SRC/Routers/userRouter.js"
import productRouter from "../api/SRC/Routers/productRouter.js"
import categoryRouter from "../api/SRC/Routers/categoryRouter.js"
import cartRouter from "../api/SRC/Routers/cartRouter.js"
app.use("/api/v1/user",  userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
