const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.get_Index);

router.get("/login", controller.get_Login);

router.post("/login", controller.post_Login);

router.get("/login/register", controller.get_Register);

router.post("/login/register", controller.post_Register);
router.get("/login/modal", controller.get_modal);

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.post("/register", controller.post_Register);

router.get("/login/find", controller.get_Find);

router.post("/login/find", controller.post_FindEmail);

router.post("/login/find", controller.post_ResetPassword);

router.post("/login/find", controller.update_Passowrd);

router.get("/login/modal", controller.get_modal);

// router.post("/register", controller.post_Register);

router.get("/feed", controller.get_Feed);

router.get("/calender", controller.get_Calender);

router.get(
  "/calender/:currentMonth/:currentYear",
  controller.get_Calender_currentData
);

router.post("/calender/addTodo", controller.post_addtodo);

router.get("/calender/changeDate", controller.get_changeDate);

router.delete("/calender/delete", controller.delete_todo);

router.get("/timer", controller.get_Timer);

router.get("/myPage", controller.get_MyPage);

router.post("/login", controller.post_Login);

router.get("/loading", (req, res) => {
  res.render("loading");
});

router.get("/get-component", controller.getComponent);

module.exports = router;
