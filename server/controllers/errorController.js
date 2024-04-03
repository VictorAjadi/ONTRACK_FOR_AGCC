const customError = require("../Utils/customError")

const devError=(res,error)=>{
   res.status(error.statusCode).send({
     status: error.status,
     message: error.message,
     stackTrace: error.stack,
     error
   })
}

const prodError=(res,error)=>{
    if(error.isOperational){
        res.status(error.statusCode).send({
            status: error.status,
            message: error.message,
          })
    }else{
        res.status(error.statusCode || 500).send({
            status: 'error',
            message: 'something went wrong,pls try again later.'
          })
    }
}
const castErrorHandler=(err)=>{
    const msg=`Invalid value for ${err.path} : ${err.value}`;
    return new customError(msg,400);
}

const duplicateKeyError=(err)=>{
    const msg=`The user with ${err.keyValue.name || err.keyValue.email } already exist.`;
    return new customError(msg,400);
}
const validatorError=(err)=>{
    const msg=err.message;
    return new customError(msg,400);
}
const tokenExpiredError=(err)=>{
    const msg=err.message;
    return new customError(msg,400);
}
const JsonWebTokenError=(err)=>{
    const msg=err.message;
    return new customError(msg,400);
}
module.exports=(error,req,res,next)=>{
    //console.log(error)
    error.statusCode=error.statusCode || 500
    error.status=error.status || 'error'
    if(process.env.NODE_ENV==='development'){
        devError(res,error)
    }else if(process.env.NODE_ENV==='production'){
        //console.log(error)
        if(error.name==='CastError'){
            error = castErrorHandler(error);
         }
         if(error.code===11000){
             error = duplicateKeyError(error);
         }
         if(error.name==='ValidationError'){
             error=validatorError(error)
         }       
         if(error.name==='TokenExpiredError'){
             error=tokenExpiredError(error)
         }
         if(error.name==='JsonWebTokenError'){
             error=JsonWebTokenError(error)
         }
        prodError(res,error)
    }
    next()
}