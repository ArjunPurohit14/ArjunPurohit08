import { AdminModel } from "../UserModels/Adminmodel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
//password incripted by bcrypt 
//bcrypt provide to two function
//1.hash-it work asynchronously 2.hashSync -synchronously work
//so install bcrypt npm i bcrypt-s;
//2 argument 1.password and 2.suffel krne ke liye

export async function saveAdmin(request, response) {
    try {
        const newpassword = bcrypt.hashSync(request.body.password, 12)
        request.body['password'] = newpassword;
        const admin = new AdminModel(request.body);
        const saveAdmin = await admin.save();
        response.status(StatusCodes.CREATED).json(saveAdmin);


    } catch (error) {

        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error in saving data " })

    }

}
//in signing2 steps first phone compare if phone is right so compare  password  plain password compare incripted password with the help of bcrypt

export async function login(request, response) {
    try {
        
        const admin = await AdminModel.findOne({ gmail: request.body.gmail });
       
          console.log(admin.password);
        
        if (admin) {
            //  console.log(request.body.password)
            // console.log(admin);
          
            if(bcrypt.compareSync(request.body.password, admin.password)) {
                //password same so generate jwt token= json web token its inclde three 
                //header=algorithm already decided
                //payload= most important it.jb token bna rhe ho tb token ke payload mei jo data=means logedin user id 
                //signature=konsi key ke basic pr hm token bna rhe hai
                //we use module jsonwebtoken-s we use json.sign(obj id,secrectkey)
                const token = jwt.sign({ adminId: admin._id }, 'hello1234');
                response.status(StatusCodes.OK).json({ token: token });

            }
            else {

                response.status(StatusCodes.BAD_REQUEST).json({ message: "invalid password" })
            }

        } else {
            response.status(StatusCodes.BAD_REQUEST).json({ message: "invalid email" })
        }

    } catch (error) {
        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error in login " })



    }
}


export async function SendsetPassword(name, gmail, randomString) {
    try {
         console.log(name)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            //  : '142.251.10.109',
            //  :'smtp.gmail.com',
            //  port: 465,

            auth: {
                user: 'rajputsumit8115@gmail.com',
                pass: 'ogqdvzuqauvfqofs'

            }
            
        })
        const mailOptions = {
            from: 'rajputsumit8115@gmail.com',
            to: gmail,
            subject: 'for reset password',
            text: 'hii  ' + name + ', Your Reset-code is : '+ randomString +' '
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                 console.log(name)
            }
            else {
                
                console.log("mail has been send")
                // console.log(info)

            }
        })

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid email" })
    }
}



export async function forgetPassword(req, res) {
    try {
        const Gmail = req.body.gmail;
        // console.log(Gmail);
        const UserData = await AdminModel.findOne({ gmail: Gmail })
        // console.log(UserData);
        // console.log(UserData.gmail);
        if (Gmail) {
            const randomString = randomstring.generate({ length: 6,   charset: 'string'});
            const data = await AdminModel.updateOne({ gmail: Gmail }, { $set: { token: randomString } })
            //send mail to use nodemailer
               console.log(UserData.gmail)
               console.log(UserData.name);
               console.log(randomString)
            SendsetPassword(UserData.name, UserData.gmail, randomString);
            res.status(StatusCodes.CREATED).json({ message: "Check your emil.." })
        }
        else {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid email" })

        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error in login " })
    }
}

export async function ResetPassword(request, response) {
    try {
        const token = request.body.token;
        console.log(token);
        const tokenData = await AdminModel.findOne({ token: token });
        // console.log(tokenData.gmail);
        if (tokenData) {
            const newpassword = bcrypt.hashSync(request.body.password, 12)
            // request.body['password'] = newpassword;
            const userData = await AdminModel.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newpassword, token: '' } }, { new: true });
            response.status(StatusCodes.OK).json({ message: "user password has been reset..",userData})



        } else {
            response.status(StatusCodes.NOT_FOUND).json({ message: " wrong token" })

        }



    } catch (error) {

        console.log(error);
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error in reset-password " })

    }


}