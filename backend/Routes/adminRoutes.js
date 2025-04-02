const express=require("express");
const User=require("../models/User");
const {protect,admin}=require("../middleware/authMiddleware");

const router=express.Router();

//@route GET /api/admin/users
//@desc Get all Users (admin only)
//@access Private/Admin

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users=await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Server Error"});
    }
});

//@route POST /api/admin/users
//@desc Add a new user (admin only)
//@access Private/Admin

router.post("/",protect,admin,async(req,res)=>{
    const { name,email,password,role}=req.body;

    try {
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"User Already Exists"});
        }

        user =new User({
            name,
            email,
            password,
            role:role || 'customer',
        });
        await user.save();
        res.status(201).json({msg:"User Created Successfully ",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Server Error"});
        
    }
});

//@route PUT/api/admin/user/:id
//@desc Update user info
//@access Private Admin


router.put("/:id",protect,admin,async(req,res)=>{
   try {
    const user = await User.findById(req.params.id);
    if(user){
        user.name=req.body.name || user.name;
        user.email=req.body.email || user.email;
        user.role=req.body.role || user.role;
    }
    const updatedUser=await user.save();
    res.status(201).json({msg:"User Updated Successfully",user:updatedUser});
   } catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server Error"});
   }
});

//@route DELETE /api/admin/user/:id
//@desc Delete user info
//@access Private Admin

router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({msg:"User Deleted Successfully"});
        }else{
            res.status(404).json({msg:"User Not Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:"Server Error"});
    }
})


module.exports = router;