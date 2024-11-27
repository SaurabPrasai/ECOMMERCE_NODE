const express=require("express")
const app=express();
const PORT=3000;
const authRoutes=require('./routes/auth');
const adminRoutes=require('./routes/admin');
const cartRoutes=require('./routes/cart');
const mongoose=require('mongoose');
const cookieParser=require("cookie-parser")
const session=require("express-session")
require('dotenv').config();




// db connection
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Connected to DB"));

// middleware
app.use(express.json());
app.use(session(
    {
        secret:process.env.EXPRESS_SESSION_SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{secure:false,httpOnly:true}
    }
))

app.use((req,res,next)=>{
    res.locals.user=req.session.userId;
    next();
})
app.use(cookieParser());
app.use(authRoutes)
app.use(adminRoutes)
app.use(cartRoutes)


// view engine
app.set('view engine','ejs');


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})