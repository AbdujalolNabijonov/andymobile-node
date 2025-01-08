const router = require("express").Router();
const memberController = require("../controllers/memberController");
const productController = require("../controllers/productController");
const notificationController = require("../controllers/notificationController");

/***************************************
 *  BACKEND SERVER SIDE RENDERING      *
 *              Router                 *
 ***************************************/

//Member related APIs
router
  .post("/signup", memberController.signup)
  .post("/login", memberController.login)
  .get("/logout", memberController.memberRetrieveEjs, memberController.logout)
  .get("/authentification", memberController.checkAuthentification)
  .get("/register", memberController.register)
  .get(
    "/companies",
    memberController.memberRetrieveEjs,
    memberController.getAllCompanies
  )
  .get("/", memberController.memberRetrieveEjs, memberController.home)
  .get(
    "/all-users",
    memberController.memberRetrieveEjs,
    memberController.getAllUsers
  )
  .post(
    "/memberUpdate",
    memberController.memberRetrieve,
    memberController.memberUpdate
  );

//Product related APIs
router
  .get(
    "/products",
    memberController.memberRetrieveEjs,
    productController.getAllProducts
  )
  .get(
    "/create-product",
    memberController.memberRetrieveEjs,
    productController.createProductProcess
  );

//Notification related APIs
router.get(
  "/notifications",
  memberController.memberRetrieveEjs,
  notificationController.getNotifications
);

//My Page Related APIs
router.get(
  "/my-page",
  memberController.memberRetrieveEjs,
  memberController.myPage
);
module.exports = router;
