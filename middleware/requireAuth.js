
const requireAuth=(req,res,next)=>{
    if (req.session.userId) {
        next(); 
    } else {
        res.redirect('/login'); 
    }
}

const preventAuth=(req,res,next)=>{
    if (req.session.userId) {
        res.redirect('/admin');
    } else {
        next();
    }
}

module.exports={requireAuth,preventAuth};