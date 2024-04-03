const customError = require("../Utils/customError");
const User = require("../models/User"),
        crypto=require("crypto"),
        asyncErrorHandler = require("../Utils/asyncErrorHandler"),
        jwt=require("jsonwebtoken"),
        util=require("util")

//protect troute middleware
exports.protect=asyncErrorHandler(async(req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    //console.log(token)
    if(!token) return next(new customError("Session token not available,try logging in again",401))
    //verify token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id)
    if(!user) return next(new customError("Invalid user ID,try logging in again",404))
    //check if the time the jwt token was issued is greater that the time the password was changed
    if((await user.compareJwtExpireTimeToWhenPasswordWasChanged(decodedToken.iat)))  return next(new customError("Interrupted session token(recent changed in password),try logging in again",404))
    req.user = user;
    next()
})
//restrict users,allow on admins
exports.restrict= (req,res,next)=>{
        if(req.user.role !== 'admin') next(new customError('user does not have permission to this route',400));
        next()       
}