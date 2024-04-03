const customError = require("../Utils/customError");
const User = require("../models/User"),
        crypto=require("crypto"),
        asyncErrorHandler = require("../Utils/asyncErrorHandler"),
        jwt=require("jsonwebtoken"),
        util=require("util"),
        sendMail=require("./../Utils/email"),
        fs=require("fs"),
        generateBarcodeDataURL=require("./../Utils/barcode")


const setTokenToHeaders = (id)=>{
  return jwt.sign({id},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRESIN}
    )
}
const createTokenAndSendResponse=(res,user,statusCode)=>{
  const token=setTokenToHeaders(user._id);
  const cookiesOption={
    maxAge: process.env.JWT_EXPIRESIN.split('h').join('') * 3600 * 1000,
    httpOnly: true
  }
  if(process.env.NODE_ENV==="production") cookiesOption.secure=true;
 res.cookie('token',token,cookiesOption);
 user.password=undefined;
 user.isActive=undefined
 user.confirmPassword=undefined
  res.status(statusCode).send({
    status: 'success',
    data: {
        user
    }
  })
}
//code for logging in the user
exports.loginUser=asyncErrorHandler(async(req,res,next)=>{
    //get email and password from user
    const {email,password}=req.body;
    if(!email || !password){
        const error = new customError("Email or Password does not exist", 400)
        return next(error)
    }
    //find user by that email
    const user = await User.findOne({email}).select("+password");
    if(!user || !(await user.comparePasswordInDB(password,user.password))) return next(new customError(`User with this ${email} email address does not exist or invalid user password`, 400))
    let d=new Date()
    let time=d.toString();
    let newArr=[...user.loginAt,time] 
    await User.findByIdAndUpdate(user._id,{loginAt: newArr})

    createTokenAndSendResponse(res,user,200);
})

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new customError(`Please enter your registered email address`, 400));
    
    const user = await User.findOne({ email });
    if (!user) return next(new customError(`Can't find user with this email: ${email}`, 404));

    const resetToken = crypto.randomBytes(32).toString('hex');
    if (!resetToken) return next(new customError("Error occurred while generating reset token", 500));

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetTokenExpiresIn = Date.now() + 5 * 60 * 1000;
    await user.save({validateBeforeSave: false});
    //console.log(user);
    const resetUrl = `${req.protocol}://${req.hostname}:${process.env.PORT || 5000}/reset/password/${resetToken}`;
    const mail = {
      body: {
          name: `${user.name}`,
          intro: 'Welcome to Our Community!',
          action: {
              instructions: 'We have received a password reset request. Here is your password reset link,click the button below.',
              button: {
                  color: '#FFD700',
                  text: 'Reset Now',
                  link: `${resetUrl}`
              }
          },
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help you out.'
      }
  };
  //console.log(user.email)
    try {
      await sendMail({
        email: user.email,
        subject: 'Password Reset Request',
        html: mail,
        link: `${req.protocol}://${req.hostname}:${process.env.PORT || 5000}/`
      });
      
      res.status(200).send({
        status: 'success',
        message: "A password reset link has been sent to your email."
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiresIn = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new customError('An error occurred while sending the password reset link.'));
    }
  });
  
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    const { resetToken } = req.params;
  
    if (!resetToken) {
      const error = new customError('Invalid URL password link, User not authorized!', 403);
      return next(error);
    }
  
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedResetToken, passwordResetTokenExpiresIn: { $gt: Date.now() } });
  
    if (!user) {
      const error = new customError('Token is invalid or expired!', 403);
      return next(error);
    }
    if(req.body.password===req.body.confirmPassword){
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetTokenExpiresIn = undefined;
    user.passwordResetToken = undefined;
    user.isPasswordChangedAt = Date.now();
  
    await user.save({ validateBeforeSave: false });
  
    createTokenAndSendResponse(res,user,200)
  }else{
    return next(new customError('Password and confirm Password does not match.',400))
  }
  });
/* exports.updateUserDetails=asyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id);
    if(!user) return next(new customError('This user session token has expired or invalid.',400))
    const {password,role,isPasswordChangedAt,passwordResetToken,passwordResetTokenExpiresIn,loginAt,createdAt,confirmPassword,...rest}=req.body;
    const updatedUser=await User.findByIdAndUpdate(user._id,rest,{new: true,runValidators: true});
    if(!updatedUser) return next(new customError('This user ID is invalid.',500))
    createTokenAndSendResponse(res,updatedUser,200)
}) */
exports.updatePassword=asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password !== req.body.confirmPassword) return next(new customError("password & confirm password does not match."))
    const user=await User.findById(req.user._id).select("+password");
    if(!user || !(await user.comparePasswordInDB(req.body.currentPassword, user.password))){
        const error=new customError('The current password you provided is not correct.',401);
        return next(error);
      }
      user.password=req.body.password;
      user.confirmPassword=req.body.confirmPassword;
      await user.save({validateBeforeSave: false});
     createTokenAndSendResponse(res,user,200)
})
exports.deleteAcc=asyncErrorHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,{isActive: false},{new: true,runValidators: true})
    res.status(204).send({
        status: 'success',
        data: null
    })
})
exports.getAllUser=asyncErrorHandler(async(req,res,next)=>{
    const allUsers=await User.find({role: 'user'});
    res.status(200).send({
        status: 'success',
        data:{
            user:allUsers
        }
    })
})
exports.getUser=asyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id);
    res.status(200).send({
        status: 'success',
        data:{
            user
        }
    })
})
exports.getUserWithId=asyncErrorHandler(async(req,res,next)=>{
  const {id}=req.params
  if(!id){
    return next(new customError('User ID must be provide to access this route.',404))
  }
  const user=await User.findById(id);
  if(!user){
    return next(new customError('This User is unavalable,retry some other time.',404))
  }
  createTokenAndSendResponse(res,user,200);
})
exports.barcodeLogin=asyncErrorHandler(async(req,res,next)=>{
  const id=req.originalUrl.split('/')[5]
  if(!id){
    return next(new customError('QrCode ID must be provide to access this route.',404))
  }
  const user=await User.findById(id);
  if(!user){
    return next(new customError('This QrCode is unavalable,retry some other time.',404))
  }
    //find user by that email
    const newUser = await User.findOne({email: user.email}).select("+password");
    if(!newUser) return next(new customError(`User with this ${email} email address does not exist or invalid user password`, 400))
    let d=new Date()
    let time=d.toString();
    let newArr=[...user.loginAt,time] 
    const updatedUser = await User.findByIdAndUpdate(user._id,{loginAt: newArr},{new: true})

    createTokenAndSendResponse(res,updatedUser,200);
})