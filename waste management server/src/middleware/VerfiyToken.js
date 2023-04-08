import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
// middileware function access three items= request ,response,next-middilware
export function VerifyToken(request, response, next) {
    //header se data fetch krne ke liye - req.get()
    const authHeader = request.get('Authorization');
    if (authHeader) {
        //authHeader co access krnege toh bearer bhi ayenga toh beare replace two type
        //    const auth=  authHeader.replace('Bearer ','');
        const auth = authHeader.split(' ')[1];

        jwt.verify(auth,"hello1234",(error,payload)=>{
               if(error){
                   response.status(StatusCodes.UNAUTHORIZED).json({message:"Access Denied"})
               }
               else{
                    next();
               }
                 
        })
        

    } else {
        response.status(StatusCodes.UNAUTHORIZED).json({ message: "Access denied" });
    }
}
//refer function on controller