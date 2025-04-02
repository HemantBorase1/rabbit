const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Product=require("./models/Product");
const User=require("./models/User");
const Cart=require("./models/Cart");
const products=require("./Data/Products");

dotenv.config();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI);

//Function to Seed Data

const seedData=async()=>{
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create a default admin User
        const createdUser=await User.create({
            name:"Hemant Borase",
            email:"hemant151@gmail.com",
            password:"797260",
            role:"admin",
        });

        //Asign the Default user Id to each Product
        const userID=createdUser._id;

        const sampleProducts=products.map((product)=>{
            return{...product,user: userID};
        });

        //Insert the Products into the Database
        await Product.insertMany(sampleProducts);

        console.log("Product Inserted Successfully.");
        process.exit();
    } catch (error) {
        console.error("Error seeding the Data:",error);
        process.exit(1);
    }
}

seedData();