const User = require("../models/index").User;
const Task = require("../models/Task").Task;
const Timer = require("../models/Timer").Timer;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
});
// multer 세부 설정
const uploadDetail = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },

    limites: { fileSize: 5 * 1024 * 1024 }, //5MB
  }),
});

// 비밀번호를 저장하기 전에 해시 처리

exports.get_Index = (req, res) => {
  res.render("index");
};

// Register post 요청 받아오기
exports.post_Register = async (req, res) => {};

exports.get_Feed = (req, res) => {
  res.render("feed");
};

exports.get_Calender = (req, res) => {
  res.render("calender");
};

exports.get_Timer = (req, res) => {
  res.render("timer");
};

exports.get_MyPage = (req, res) => {
  res.render("myPage");
};
