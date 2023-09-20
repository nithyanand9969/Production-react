const express = require("express");
const {registerController, loginController, updateUserController} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);

//update APi

router.put("/update-user",updateUserController);

module.exports = router;
