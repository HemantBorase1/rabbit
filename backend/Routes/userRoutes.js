const express=require("express");
const User=require("../models/User");
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");
const { protect } = require('../middleware/authMiddleware');

const router=express.Router();

//


router.post("/register",async(req,res)=>{
    const{name,email,password}=req.body;

    try {
      //Registration Logic
      let user=await User.findOne({email});

      if(user){
        res.status(400).json({msg:"User already Exists"});
      }
      user=new User({name,email,password});
      await user.save();

    // Create JWT Payload
    const payload={user:{id:user._id,role:user.role}}

    //Sign & Return the token
    jwt.sign(payload,process.env.JWT_SECRET,
      {expiresIn:"40h"},
    (err,token)=>{
      if(err) throw err;

      //Send the user & token in response
      res.status(201).json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token,
      });
    }
    );

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

//@route POST /api/user/login
//@desc Authenticate User
//@access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
      // Find the User by Email
      let user = await User.findOne({ email });
      
      // Check if user exists
      if (!user) {
          return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Create JWT Payload
      const payload = {
          user: {
              id: user._id,
              role: user.role
          }
      };

      // Sign & Return the token
      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "400h" },
          (err, token) => {
              if (err) throw err;
              
              // Send the user & token in response
              res.json({
                  user: {
                      _id: user._id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                  },
                  token,
              });
          }
      );

  } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
      res.json(req.user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;