const customError = require("../Utils/customError");
const User = require("../models/User"),
      express=require("express"),
      userController= require("../controllers/userControllers"),
      authController=require("./../controllers/authController"),
      multer=require("multer"),
      jwt=require("jsonwebtoken"),
      util=require("util"),
      sendMail=require("./../Utils/email"),
      fs=require("fs"),
      generateBarcodeDataURL=require("./../Utils/barcode")

      const storage=multer.memoryStorage()
      const upload = multer({
        storage: storage,
        limits: { fileSize: 15 * 1024 * 1024 }
        });
        const uploadUpdate = multer({
          storage: storage,
          limits: { fileSize: 15 * 1024 * 1024 }
          });
const router=express.Router();
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

router.route("/signup").post(upload.single('image'),async(req,res,next)=>{
    try{
      if(!req.file) return next(new customError('Please upload your profile image.',400))
        const photoBuffer = req.file.buffer; // Get the uploaded image buffer
        // Convert image buffer to base64
        const photoData = photoBuffer.toString('base64');
          let d=new Date();
          let time=d.toString();
          const newBody={...req.body,...{loginAt: time,photo: `data:image/png;base64,${photoData}`}}
          const user = await User.create(newBody);
          let barcodeImage=await generateBarcodeDataURL(user._id);
          const newUser=await User.findByIdAndUpdate(user._id,{barcode:barcodeImage},{new: true})
          if(newUser){
            const mail = {
                body: {
                    greeting: `Hello,${user.name}`,
                    intro: `Welcome to Our Community!\n\nThank you for signing up. We're excited to have you on board\n\n`,
                    // QR code image
                    qrCode: {
                        src: `${barcodeImage}`,
                        alt: '',
                        // Set the width of the QR code image
                        width: '200px',
                        height: '200px',
                    },
                    outro: 'If you have any questions or need assistance, feel free to reach out to us.'
                }
            };

              await sendMail({
                email: user.email,
                html: mail,
                link: `${req.protocol}://${req.hostname}:${process.env.PORT || 5000}/`
              });
            createTokenAndSendResponse(res,user,201);
          }
    }catch(error){
      return next(error);
    }
})
router.route("/login").post(userController.loginUser)
router.route("/barcode/login/:id").post(userController.barcodeLogin)
router.route("/forgot/password").post(userController.forgotPassword)
router.route("/reset/password/:resetToken").patch(userController.resetPassword)
router.route("/details").patch(authController.protect, uploadUpdate.single('image'), async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new customError('This user session token has expired or is invalid.', 400));

  // Destructure only the fields you want to update from the request body
  const { password, role, isPasswordChangedAt, passwordResetToken, passwordResetTokenExpiresIn, loginAt, createdAt, confirmPassword,isAtive, ...rest } = req.body;

  // If there's a file in the request, update the photo field
  if (req.file) {
      const photoBuffer = req.file.buffer;
      let photoData = photoBuffer.toString('base64');
      rest.photo = `data:image/png;base64,${photoData}`;
  }
  let newUser={
    name: rest.name || user.name,
    email: rest.email || user.email,
    mobileNumber: rest.mobileNumber || user.mobileNumber,
    residentials: rest.residentials || user.residentials,
    worker: rest.worker || user.worker,
    department: rest.department || user.department,
    photo:rest.photo || user.photo
  }
  try {
      // Update the user document, excluding the email field
      const updatedUser = await User.findByIdAndUpdate(user._id, newUser, { new: true, omitUndefined: true });

      if (!updatedUser) {
          const error = new customError('You cannot access this endpoint. Please log in again.', 401);
          return next(error);
      }

      createTokenAndSendResponse(res, updatedUser, 201);
  } catch (err) {
      // Check if the error is a duplicate key error
      if (err.code === 11000) {
          return next(new customError('The provided email already exists.', 400));
      }
      return next(new customError('Internal server error', 500));
  }
});



router.route("/password").patch(authController.protect,userController.updatePassword)
router.route("/account").delete(authController.protect,userController.deleteAcc)
router.route("/all").get(authController.protect,authController.restrict,userController.getAllUser)
router.route("/one").get(authController.protect,userController.getUser)
router.route("/by/:id").get(userController.getUserWithId)
module.exports=router;
//const { password, role, isPasswordChangedAt, passwordResetToken, passwordResetTokenExpiresIn, loginAt, createdAt, confirmPassword, ...rest } = req.body;
