const express=require("express");
const Cart=require("../models/Cart");
const Product=require("../models/Product");
const {protect} =require("../middleware/authMiddleware");

const router=express.Router();

//Helper function to get a cart by User Id or Guest Id
const getCart=async(userId,guestId)=>{
    if(userId){
        return await Cart.findOne({user:userId});
    }else if(guestId){
        return await Cart.findOne({guestId});
    }
    return null;
}
//@route POST /api/cart
//@desc Add a product to the Cart for a guest or logged in user
//@access Public

router.post("/",async(req,res)=>{
    const{productId,quantity,size,color,guestId,userId}=req.body;
    try {
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({msg:"Product not Found"});
        }
        //Determine if the User is logged in or guest
        let cart=await getCart(userId,guestId);

        // If the Cart Exists,update it
        if(cart){
            const productIndex=cart.products.findIndex(
                (p)=>
                    p.productId.toString()=== productId &&
                p.size===size &&
                p.color===color
            );
            if(productIndex>-1){
                //If the Product already Exists,Update the Quantity
                cart.products[productIndex].quantity+=quantity;
            }else{
                // add new Product
                cart.products.push({
                    productId,
                    name:product.name,
                    image:product.image[0].url,
                    price:product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // Recalculate the Total Price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + (item.price * item.quantity), 0
            );
            await cart.save();
            return res.status(200).json(cart);
        }else{
            // Create a new Cart with safety checks
            const imageUrl = product.image && product.image[0] ? product.image[0].url : '';
            const newCart=await Cart.create({
                userId: userId || undefined,
                guestId: guestId || "guest_" + new Date().getTime(),
                products:[
                    {
                    productId,
                    name: product.name,
                    image: imageUrl,
                    price: product.price || 0,
                    size,
                    color,
                    quantity,
                    },
                ],
                totalPrice: (product.price || 0) * (quantity || 1),
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Server Error"});
        
    }
});

//@route PUT /api/cart
//@desc Update product quantity in the cart for a guest or logged-in user
//@access Public 
router.put("/",async (req,res)=>{
    const{productId,quantity,size,color,guestId,userId}=req.body;

    try{
        let cart=await getCart(userId,guestId);
        if(!cart) return res.status(404).json({msg:"Cart not Found"});

        const productIndex=cart.products.findIndex(
        (p)=>p.productId.toString()===productId
         && p.size===size 
         && p.color===color);

         if(productIndex>-1){
            //update quantity
            if(quantity>0){
                cart.products[productIndex].quantity=quantity;
            }else{
                cart.products.splice(productIndex,1); //Remove product if Quantity is 0
            }

            cart.totalPrice=cart.products.reduce(
                (acc,item)=>acc+item.price* item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
         }else{
            return res.status(404).json({msg:"Product Not Found in Cart"})
         }
    }catch(error){
            console.error(error);
            return res.status(500).json({msg:"Server Error"});
            
    }
});

//@route DELETE /api/cart
//@desc Remove a product from the cart
//@access Public

router.delete("/",async(req,res)=>{
    const{productId,size,color,guestId,userId}=req.body;
    try {
        let cart=await getCart(userId,guestId);

        if(!cart) return res.status(404).json({msg:"Cart not Found"});

        const productIndex=cart.products.findIndex(
            (p)=>p.productId.toString()===productId &&
             p.size===size && 
             p.color===color
        )

        if(productIndex >-1){
            cart.products.splice(productIndex,1);

            cart.totalPrice=cart.products.reduce(
                (acc,item)=>acc+item.price  * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        }
        else{
            return res.status(404).json({msg:"Product Not Found in Cart"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Server Error"});
        
    }
});


// @route GET /api/cart
// @desc Get logged-in User's or guest user's cart
// @access Public
router.get("/",async (req,res)=>{
    const{userId,guestId}=req.query;

    try {
        const cart=await getCart(userId,guestId);
        if(cart){
            res.json(cart);
        }else{
            res.json({msg:"Cart not Found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Server Error"});
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private

router.post("/merge",protect,async(req,res)=>{
    const {guestId}=req.body;

    try {
        // Find the guest cart & user cart
        const guestCart=await Cart.findOne({guestId});
        const userCart=await Cart.findOne({user:req.user._id});

        if(guestCart){
            if(guestCart.products.length===0){
                return res.status(400).json({msg:"Guest cart is empty"});
            }
            if(userCart){
                //Merge guest cart into user cart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex(
                        (item)=>
                            item.productId.toString()=== guestItem.productId.toString() &&
                        item.size===guestItem.size &&
                        item.color===guestItem.color
                    );
                    if(productIndex>-1){
                        // If the items exists in the user cart,update the quantity
                        userCart.products[productIndex].quantity+=guestItem.quantity;
                    }else{
                        //Otherwise add the guest item to cart
                        userCart.products.push(guestItem);
                    }
                });
                userCart.totalPrice=userCart.products.reduce(
                    (acc,item)=>acc+item.price*item.quantity,0
                );
                await userCart.save();

                //Remove the guest cart after merging
                try {
                    await Cart.findByIdAndDelete({guestId});
                } catch (error) {
                    console.error("Error deleting guest cart:",error);
                    
                }
                res.status(200).json(userCart);
            }else{
                //If the User no Existing cart,assign the guest cart to the user
                guestCart.user=req.user._id;
                guestCart.guestId=undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }

        }else{
            if(userCart){
                //Guest cart has already been merged,return user cart
                return res.status(200).json(userCart);
            }
            res.status(404).json({msg:"Guest Cart not Found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Server Error"});
    }
})
module.exports=router;