import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import noteRoutes from "./routes/noteRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from './routes/userRoutes.js';



dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors(
  {
    origin: "https://scribly-frontend-v3-dot-xenon-axe-450704-n3.uc.r.appspot.com", 
    credentials: true,  
  } 
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/notes", noteRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);


const connectDB = async ()=>{
  try{
    await db.authenticate();
    console.log("Database connected...");

    await db.sync();
    console.log("Database synchronized...");
  }catch(error){
    console.error("Connection error: ", error);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();
