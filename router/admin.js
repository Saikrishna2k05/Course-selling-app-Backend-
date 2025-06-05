const {Router} = require('express');
const adminRouter=Router();
const {AdminModel, CourseModel}=require('../db');
const bcrypt=require('bcrypt')
const {z}=require('zod');
const jwt=require('jsonwebtoken');
const {adminMiddleware}=require('../middlewares/admin');
const JWT_ADMIN_SECRET =process.env.JWT_ADMIN_SECRET;
adminRouter.post('/signup',async(req, res)=>{
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
        await AdminModel.create({
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

adminRouter.post('/signin',async (req, res)=>{
    try
    {
        const {email, password}=req.body;
        const user=await AdminModel.findOne({
            email
        })
        const isPasswordMatched=await bcrypt.compare(password, user.password);
        if(user && isPasswordMatched)
        {
            const token=jwt.sign({ id: user._id }, JWT_ADMIN_SECRET);
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

adminRouter.post('/course',adminMiddleware, async(req,res)=>{
    try
    {
        const adminId=req.adminId;
        const {title, description, price, image}=req.body;
        const course=await CourseModel.create({
            title,
            description,
            price,
            image,
            creatorId: adminId
        })

        res.status(201).json({
            message: `${course.title} course is created`,
            courseId: course._id
        })
    }
    catch(err)
    {
        res.status(400).json({
            error: err.message || "Something went wrong"
        })
    } 
})

adminRouter.put('/course',adminMiddleware, async(req, res)=>{
    try{
        const {title, description, price, image}=req.body;
        const course=await CourseModel.findOne({
            title,
            creatorId: req.adminId
        })
        if(!course)
        {
            return res.status(400).json({
                error: `There is no Course named ${title} by ${req.adminId.username}`
            })
        }
        if(title!==undefined) course.title=title;
        if(description!==undefined) course.description=description;
        if(price!==undefined) course.price=price;
        if(image!==undefined) course.image=image;
        await course.save();
        res.status(201).json({
            message: "Updated the course details sucessfully"
        })
    }
    catch(err)
    {
        res.json({
            error: err.message || "Something went wrong"
        })
    }

})

adminRouter.get('/course/all',adminMiddleware, async()=>{
    const adminId=req.adminId;
    const courses=await CourseModel.find({
        creatorId: adminId
    })
    if(courses.length===0){
        return res.status(400).json({
            error: `${adminId.username} do not have courses yet`
        })
    }
    res.json(
        {
            courses
        }
    )
})
module.exports={
    adminRouter: adminRouter
}
