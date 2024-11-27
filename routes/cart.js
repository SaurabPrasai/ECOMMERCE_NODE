const { requireAuth } = require('../middleware/requireAuth');
const Product = require('../models/product');

const router=require('express').Router();

router.get("/cart",(req,res)=>{
    const cart=req.session.cart||[];
    let totalPrice=0;
    if(cart.length>0){
        for(i=0;i<cart.length;i++){
            totalPrice+=cart[i].quantity*cart[i].price
        }
    }
    return res.render("cart",{title:"Cart",cart,totalPrice});
})



router.get("/add-to-cart/:id",requireAuth,async(req,res)=>{
   try {
        const product=await Product.findById(req.params.id)
        
         if(!req.session?.cart){
            req.session.cart=[];
         }
         const existingProductIndex=req.session.cart.findIndex(item=>item.id==req.params.id)
         if(existingProductIndex!==-1){
            req.session.cart[existingProductIndex].quantity+=1;
         }else{
            req.session.cart.push({
                id:product._id,
                name:product.name,
                price:product.price,
                image:product.image,
                quantity:1
            })
         }
         return res.redirect('/cart')
   } catch (error) {
        console.log(error);
   }
})


// delete cart items
router.get("/delete-cart/:id",requireAuth,(req,res)=>{
try {
        req.session.cart=req.session.cart.filter((item)=>item.id!==req.params.id);
        res.redirect('/cart')
} catch (error) {
console.log(error);
}
})

module.exports=router