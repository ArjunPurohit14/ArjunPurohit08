import  express  from "express";
import empRouter from "./src/Router/EmployeesRouter.js";
import adminRouter from "./src/Router/AdminRouter.js";
import { configuredb } from "./dbconfig.js";
import cors from "cors";
// cors always top pr call krna hai
const app =express();
app.use(cors());
 app.use(express.json());
 app.use(empRouter);
 app.use(adminRouter);

app.listen(5500,()=>{
    configuredb();
    console.log("listening  in port");
});