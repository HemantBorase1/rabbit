const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
//@route POST /api/checkout
//@desc Create a new Checkout Session
//@access Private

router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ msg: "No items in Checkout" });
    }

    try {
        // Create a new Checkout Session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: true,
            paidAt: Date.now(),
        });
        console.log(`Checkout created for User: ${req.user._id}`);
        res.status(201).json(newCheckout);
        
    } catch (error) {
        console.error("Error Creating checkout session:", error);
        res.status(500).json({ msg: "Server Error" });
        
    }
});

//@route PUT /api/checkout/:id/pay
//@desc Update checkout to mark as paid after Successful payment
//@access Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ msg: "Checkout Not Found" });
        }
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({ msg: "Invalid Payment Status -" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error -" + error.message });
    }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout & convert to an order payment Confirmation
//@access Private

router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ msg: "Checkout Not Found" });
        }

        if (checkout.isPaid && !checkout.isFinalized) {
           
            // Create final Order based on the Checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            });

            // Mark the Checkout as Finalized
            checkout.isFinalized = true;
            checkout.isFinalizedAt = Date.now();
            await checkout.save();

            // Delete the Cart associated with the User
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
            
        } else if (checkout.isFinalized) {
            return res.status(400).json({ msg: "Checkout already finalized" });
        } else {
            return res.status(400).json({ msg: "Checkout is not Paid" });
        }
    } catch (error) {
        console.error('Finalize Checkout Error:', error);
        return res.status(500).json({ 
            msg: "Server Error from Finalize",
            error: error.message
        });
    }
});

module.exports = router;
