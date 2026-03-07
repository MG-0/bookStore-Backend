const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const UserRouter = require("./routes/users");
const BookRouter = require("./routes/books");
const CategoryRouter = require("./routes/category");
const AdminRouter = require("./routes/admin");
const CartRouter = require("./routes/carts")
const cookieParser = require("cookie-parser");

const app = express();

connectDB();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());

app.use("/users", UserRouter);
app.use("/books", BookRouter);
app.use("/categories", CategoryRouter);
app.use("/admin", AdminRouter);
app.use("/carts", CartRouter);
app.use("/images", express.static("images"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
