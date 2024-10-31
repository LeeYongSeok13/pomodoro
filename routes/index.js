const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.get_Index);

router.get("/feed", controller.get_Feed);

router.get("/calender", controller.get_Calender);

router.get("/timer", controller.get_Timer);

router.get("/myPage", controller.get_MyPage);
module.exports = router;
