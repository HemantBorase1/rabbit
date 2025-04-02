const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountprice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collectionName,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            metaTitle,
            metaDescription,
            metaKeywords
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountprice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collectionName,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            metaTitle,
            metaDescription,
            metaKeywords,
            user: req.user._id, // Reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product by ID
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const productId = req.params.id.replace(':', ''); // Remove the colon if present

        // Find product by ID
        const productToUpdate = await Product.findById(productId);

        if (!productToUpdate) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        const {
            name,
            description,
            price,
            discountprice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collectionName,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            metaTitle,
            metaDescription,
            metaKeywords
        } = req.body;

        // Update product fields
        if (productToUpdate) {
            productToUpdate.name = name || productToUpdate.name;
            productToUpdate.description = description || productToUpdate.description;
            productToUpdate.price = price || productToUpdate.price;
            productToUpdate.discountprice = discountprice || productToUpdate.discountprice;
            productToUpdate.countInStock = countInStock || productToUpdate.countInStock;
            productToUpdate.category = category || productToUpdate.category;
            productToUpdate.brand = brand || productToUpdate.brand;
            productToUpdate.sizes = sizes || productToUpdate.sizes;
            productToUpdate.colors = colors || productToUpdate.colors;
            productToUpdate.collectionName = collectionName || productToUpdate.collectionName;
            productToUpdate.material = material || productToUpdate.material;
            productToUpdate.gender = gender || productToUpdate.gender;
            productToUpdate.images = images || productToUpdate.images;
            productToUpdate.isFeatured = isFeatured !== undefined ? isFeatured : productToUpdate.isFeatured;
            productToUpdate.isPublished = isPublished !== undefined ? isPublished : productToUpdate.isPublished;
            productToUpdate.tags = tags || productToUpdate.tags;
            productToUpdate.dimensions = dimensions || productToUpdate.dimensions;
            productToUpdate.weight = weight || productToUpdate.weight;
            productToUpdate.sku = sku || productToUpdate.sku;
            productToUpdate.metaTitle = metaTitle || productToUpdate.metaTitle;
            productToUpdate.metaDescription = metaDescription || productToUpdate.metaDescription;
            productToUpdate.metaKeywords = metaKeywords || productToUpdate.metaKeywords;

            // Save the updated product to the database
            const updatedProduct = await productToUpdate.save();
            res.json(updatedProduct);
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const productToDelete = await Product.findById(req.params.id);

        if (productToDelete) {
            // Remove the product from the database
            await productToDelete.deleteOne();
            res.json({ message: "Product Removed" });
        } else {
            res.status(404).json({ message: "Product Not Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route   GET /api/products
// @desc    Get all products with optional query filters
// @access  Public
router.get("/", async (req, res) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;

        let query = {};

        // Filter logic
        if (collection && collection.toLowerCase() !== "all") {
            query.collectionName = collection;
        }
        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }
        if (material) {
            query.material = { $in: material.split(",") };
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.sizes = { $in: size.split(",") };
        }
        if (color) {
            query.colors = { $in: [color] };
        }
        if (gender) {
            query.gender = gender;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        // Fetch products & apply sorting & limit
        let products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route GET /api/products/best-seller
//@desc Retrive the Product with Highest rating
//@access Public 
router.get("/best-seller",async(req,res)=>{
    try {
        const bestSeller=await Product.findOne().sort({rating:-1});
        if(bestSeller){
            res.json(bestSeller);
        }else{
            res.status(404).json({msg:"No Best Seller Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
});

//@route GET/api/products/new-arrivals
//@desc Retrive latest 8 products -Creation Date
// @access Public

router.get("/new-arrivals",async(req,res)=>{
    try {
        //Fetch latest 8 Products
        const newArrivals=await Product.find().sort({createdAt:-1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
        
    }
})

//@route GET /api/products/:id
//@desc GET a single product by ID
//@access Public

router.get("/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }
        else{
            console.error(error);
            res.status(500).send("Server Error")
            res.status(404).json({msg:"Product Not Found"});
        }
    } catch (error) {
    }
});

//@route GET /api/products/similar/:id
//@desc Retrive similar products on the Current product's gender & category
//@access Public
router.get("/similar/:id",async(req,res)=>{
    const{id}=req.params;
   // console.log(id);

   try {
    const product=await Product.findById(id);

    if(!product){
        return res.status(404).json({msg:"Product Not Found"});
    }

    const similarProducts=await Product.find({
        _id:{$ne:id},
        gender:product.gender,
        category:product.category,
    }).limit(4);

    res.json(similarProducts);
   } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
   }
    
});



module.exports = router;