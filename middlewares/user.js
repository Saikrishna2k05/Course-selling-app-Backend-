const jwt=require("jsonwebtoken");
function userMiddleware(req, res, next)
{
    const token=req.headers.token;
    const user=jwt.verify(token,process.env.JWT_USER_SECRET);
    if(user)
    {
        req.userId=user.id;
        next();
    }
    else{
        res.status(401).json({
            error: "Authentication failed"
        })
    }
}

module.exports={
    userMiddleware
}