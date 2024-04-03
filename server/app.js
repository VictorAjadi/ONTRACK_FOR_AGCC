const express = require("express"),
      morgan= require("morgan"),
      userRouter=require("./routes/userRoute"),
      customError=require("./Utils/customError"),
      errorController=require("./controllers/errorController"),
      expressRateLimiter=require("express-rate-limit"),
      helmet=require("helmet"),
      xss=require("xss-clean"),
      sanitize=require("express-mongo-sanitize"),
       cors = require('cors'),
       path = require('path'),
       fs=require("fs"),
       cookieParser = require('cookie-parser')

const app = express();

app.use(cors()); // Enable CORS for cross-origin requests
//app.use(formidableMiddleware());
helmet.contentSecurityPolicy({ //for adding secure http headers
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'blob:'], // Allow images from 'self', data URIs, and blob: URLs
    // ... other directives as needed
  },
})
app.disable('x-powered-by'); //used to disable our backend stack so hackers do not know our stack
let limiter=expressRateLimiter({//this is used to prevent too many request that may lead to DOS and Bruteforce attack
    max: 1000,
    windowMs: 60 * 60 * 1000,//here we are making the route reusable after 1hr which is converted to milliseconds
    message: 'we have received too many request from this IP.please try again later in about one hour time.'
})
//middle-wares

app.use('/api', limiter);//using the express-rate-limiter middle-ware
app.use(express.json({limit: '10kb'}));//require to read request body in json format
app.use(sanitize());//used to sanitize request body from the client/hackers
app.use(xss());//used to remove script/html codes
app.use(morgan("dev"));
app.use(cookieParser()); // Add cookie-parser middleware

//app.use("/api/movies",moviesRouter);//movie router middle-ware
app.use("/api/user",userRouter);//user router middle-ware

// Route to retrieve the token from the cookie
app.get('/get-token', (req, res) => {
  // Retrieve the token from the cookie
  const token = req.cookies.token;
  if (token) {
    res.status(200).send({
      status: "success",
      token
    }
    );
  } else {
    res.status(404).send({
      status: "fail",
      message: "Token not found"
    })
  }
});

// Route to delete the token from the cookie
app.get('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.send('Logged out successfully!');
});
// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../build'))); // Serve static files from the build folder

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html')); // Serve index.html for all routes
});
app.all('*',(req,res,next)=>{//catching all undefined route and sending back an error
/*     res.status(404).json({
        status: 'fail',
        message: `can't find this ${req.originalUrl} in the routes`
    }) */
    const err=new customError(`can't find this ${req.originalUrl} in the routes`,404)//custom error
    next(err);
})
app.use(errorController);
module.exports=app;