const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.get_Index);


router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/register", controller.post_Register);

router.get("/feed", controller.get_Feed);

router.get("/calender", controller.get_Calender);

router.get("/timer", controller.get_Timer);

router.get("/myPage", controller.get_MyPage);

router.post("/login", controller.post_login);
module.exports = router;
