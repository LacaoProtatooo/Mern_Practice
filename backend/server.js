// const express = require('express');
import express from "express"; // Require Import
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product_route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

const __dirname = path.resolve();

app.use(express.json());  // Allows to accept JSON data in the req.body
// console.log(process.env.MONGO_URI);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Router
app.use("/api/products", productRoutes);

app.listen(5000, () => {
    connectDB();
    console.log("Server Started at http://localhost:" + PORT);
});
