const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { cookieAuth} = require("../auth/middleware")


// User Signup
router.post("/signup", userController.signup);

// User Signin 
router.post("/signin", userController.signin);

// user verification
router.get("/verify", cookieAuth(), userController.verify);

// user Signout
router.post("/signout", userController.signout )

// Get User By ID
router.get("/:id", userController.getUser )

module.exports = router;
