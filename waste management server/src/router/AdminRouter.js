import express from "express";
import { forgetPassword, login, ResetPassword, saveAdmin } from "../Controller/AdminController.js";
const adminRouter = express.Router();
adminRouter.post("/admins",saveAdmin);
adminRouter.post("/login",login)
adminRouter.post("/forget-password",forgetPassword)
 adminRouter.post('/reset-password', ResetPassword)
export default  adminRouter;


