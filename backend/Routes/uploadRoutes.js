const express=require("express");
const multer=require("multer");
const cloudinary=require("cloudinary").v2;
const streamifier=require("streamifier");


require("dotenv").config();

const router=express.Router();

//Cloudinary Configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup using Memory Setup
const storage=multer.memoryStorage();
const upload=multer({storage});

router.post("/",upload.single("image"),async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({msg:"No file Uploaded"});
        }

        //Function to handle the stream upload to Cloudinary
        const streamUpload=(fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream=cloudinary.uploader.upload_stream(
                    { folder: 'uploads' },
                    (error,result)=>{
                        if(error){
                            reject(error);
                            return;
                        }
                        resolve(result);
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        // Call the streamUpload function 
        const result=await streamUpload(req.file.buffer);

        //Respond with the uploaded image URL
        res.json({
            imageUrl:result.secure_url,
            public_id:result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({msg:"Server Error", error:error.message});
        
    }
})

module.exports=router;