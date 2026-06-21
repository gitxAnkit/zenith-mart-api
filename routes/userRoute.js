const express = require("express");
const { registerUser, logingUser,
    logout, forgotPassword,
    resetPassword, getUserDetails,
    updatePassword, updateProfile,
    getAllUser, getSingleUser,
    updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(logingUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUser);

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);
module.exports = router;
