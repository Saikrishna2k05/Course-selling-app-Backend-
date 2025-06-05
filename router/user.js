const {Router} = require('express');
const userRouter=Router();

const {UserModel, PurchaseModel}=require('../db');
const {userMiddleware}=require('../middlewares/user');

const bcrypt=require('bcrypt')
const {z}=require('zod');
const jwt=require('jsonwebtoken');
const JWT_USER_SECRET=process.env.JWT_USER_SECRET;

userRouter.post('/signup',async(req, res)=>{
     try{
            const signupSchema=z.object({
                email: z.string().email(),
                username: z.string(),
                password: z.string(),
                firstname: z.string(),
                lastname: z.string()
            })
            const {success, data, error}=signupSchema.safeParse(req.body);
            if(!success) {
                return res.status(400).json({
                    success: false,
                    error: error.errors || "Invalid input data"
                });
            }
    
            const {email, username,password, firstname, lastname}=data;
            const hashedPassword=await bcrypt.hash(password, 10);
            await UserModel.create({
                email,
                username,
                password: hashedPassword,
                firstname,
                lastname
            })
            res.json({
                message: "Succesfully signed up"
            })
        }
        catch(err){
            if (err.code === 11000) 
            {
                return res.status(409).json({ error: "Email or username already exists" });
            }   
            res.status(400).json({
                err: err.message || "Something went wrong"
            })
    
        }
})

userRouter.post('/signin',async(req, res)=>{
     try
    {
        const {email, password}=req.body;
        const user=await UserModel.findOne({
            email
        })
        const isPasswordMatched=await bcrypt.compare(password, user.password);
        if(user && isPasswordMatched)
        {
            const token=jwt.sign({ id: user._id }, JWT_USER_SECRET);
            res.json({
                message:"Signed in successfully",
                token: token
            })
        }
        else{
            res.status(401).json({
                error:"Bad credentials"
            })
        }
    }
    catch(err)
    {
        res.status(400).json({
            error: err.message || "Something went wrong"
        })
    }
})


userRouter.get('/purchases',userMiddleware, async(req, res)=>{
    try{
    const userId=req.userId;
    const allPurchases=await PurchaseModel.find({
        userId
    })
    res.json(
        {
            allPurchases
        }
    )
    }
    catch(err)
    {
        res.json({
            err: err.message || "Something went wrong"
        })
    }
})

module.exports={
    userRouter: userRouter
}

