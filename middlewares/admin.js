const jwt=require("jsonwebtoken");

function adminMiddleware(req, res, next)
{
    const token=req.headers.token;
    const admin=jwt.verify(token,process.env.JWT_ADMIN_SECRET);
    if(admin)
    {
        req.adminId=admin.id;
        next();
    }
    else{
        res.status(401).json({
            error: "Authentication failed"
        })
    }
}

module.exports={
    adminMiddleware
}