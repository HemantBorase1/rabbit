const express=require("express");
const router=express.Router();
const Subscriber=require("../models/Subscribe");


//@route POST /api/subscribe
//@desc Handle newsletter subscription
// @access Public
router.post("/subscribe",async(req,res)=>{
    const{email}=req.body;

    if(!email){
        return res.status(400).json({msg:"Email is required"});
    }

    try {
        // Check if the email is already subscribed
        let subscribe=await Subscriber.findOne({email});

        if(subscribe){
            return res.status(400).json({msg:"Email is already subscribed"});
        }

        // Create a new Subscriber
        subscriber=new Subscriber({email});
        await subscriber.save();

        res.status(201).json({msg:"Successfully Subscribed to the Newsletter!"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Server Error"});
                
    }
});

module.exports=router;