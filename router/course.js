const {Router} = require('express');
const courseRouter=Router();
const {CourseModel, PurchaseModel, UserModel}=require('../db');
const { userMiddleware }=require('../middlewares/user');

courseRouter.post('/purchase',userMiddleware, async(req, res)=>{
    try
    {
        const userId=req.userId;
        const courseId=req.body.courseId;
        const user=await UserModel.findById(userId);
        const course=await CourseModel.findById(courseId);
        const alreadyBought=await PurchaseModel.findOne({
            userId,
            courseId
        })
        if(alreadyBought) {
            return res.status(409).json({
                error:`${user.username} had already bought the course ${course.title}`
            })
        }
        if(!course)
        {
            return res.status(401).json({
                error:"There is no Course with given courseId"
            })
        }
        await PurchaseModel.create({
            courseId,
            userId
        })
        res.status(201).json({
            message:`${user.username} bought the course ${course.title}`
        })
    }
    catch(err)
    {
        res.status(400).json({
            error: err.message || "Something went wrong"
        })
    }

})

courseRouter.get('/preview',async(req, res)=>{
    try{
        const allCourses=await CourseModel.find({});
        res.json({
            courses: allCourses
        })
    }
    catch(err)
    {
        res.status(400).json({
            error: err.message || "Something went wrong"
        })
    }
})

module.exports={
    courseRouter: courseRouter
}
