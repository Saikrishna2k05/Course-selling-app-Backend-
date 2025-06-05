require('dotenv').config()
require('./db');
const express=require('express');
const app=express();
const port=3000;
const {userRouter}=require('./router/user');
const {adminRouter}=require('./router/admin');
const {courseRouter}=require('./router/course');
app.use(express.json()); 
app.use('/user',userRouter);
app.use('/admin', adminRouter);
app.use('/course', courseRouter);

app.listen(port,()=>{
    console.log(`Server started running at http://localhost:${port}`);
});