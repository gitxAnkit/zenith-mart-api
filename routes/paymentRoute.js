const express = require("express");
const {
    processPayment,
    sendStripeApiKey,
} = require("../controllers/paymentControllers.js");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth.js")
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;