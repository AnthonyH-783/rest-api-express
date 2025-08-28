const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");


dotenv.config();

isMongooseConnected().catch(err => console.log(err));

async function isMongooseConnected() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");

  
}

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


app.get("/", (req,res)=> {
    res.send("Welcome to homepage");
})

app.listen(8800, ()=>{
    console.log("Backend server is running now")
})