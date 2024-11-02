const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.get_Index);

router.get("/login", (req, res) => {
  res.render("login");
});
module.exports = router;
