const db = require("../models/index");
const User = require("../models/index").User;
const Task = require("../models/Task").Task;
const Timer = require("../models/Timer").Timer;
// 비밀번호 암호화
const bcrypt = require("bcrypt");
const plainpassword = "user_password";
const saltRounds = 10;

bcrypt.hash(plainpassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password", err);
    return;
  }
  // 해시된 비밀번호를 데이터베이스에 저장
  console.log("Hashed password: ", hash);
});

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

exports.get_Index = (req, res) => {
  // 세션 권한 없으면 login으로 가야함!!!
  if (req.session.isAuthenticated) {
    res.render("index");
  } else {
    // 데이터 구현시 index 대신 login 넣기!!!
    res.redirect("/login");
  }
};
exports.get_login = () => {
  res.render("login");
};

exports.get_Login = (req, res) => {
  res.render("login");
};

exports.post_login = async (req, res) => {
  const { emailAddr, password } = req.body;
  console.log(req.body);

  // 입력 값 검증
  if (!emailAddr || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 이메일로 사용자 검색
    const user = await User.findOne({ where: { emailAddr } });
    // 사용자가 존재하지 않거나 비밀번호가 틀린 경우
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 로그인 성공
    req.session.isAuthenticated = true; // 로그인 성공 시 세션 설정
    res.redirect("/");
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.get_Register = async (req, res) => {
  res.render("register");
};

exports.post_Register = async (req, res) => {
  try {
    const { username, nickname, emailAddr, password, phoneNumber } = req.body;

    // 입력값 검증
    if (!username || !emailAddr || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required" });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { emailAddr } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      username,
      nickname,
      emailAddr,
      password: hashedPassword,
      phoneNumber,
    });

    console.log(newuser);
    res.status(201).json(newuser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Interval Server Error!"); // 500 상태 코드 변환
  }
};

exports.get_Find = async (req, res) => {
  res.render("find");
};

exports.post_Find = async (req, res) => {
  const { username, phoneNumber } = req.body;

  try {
    // 이름과 전화번호로 사용자 검색
    const user = await User.findOne({
      where: {
        username: req.body.username,
        phoneNumber: req.body.phoneNumber,
      },
    });

    // 사용자가 존재하지 않으면 에러 메세지 반환
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found with that name and phone number" });
    }

    // 이메일 반환
    res.json({ emailAddr: user.emailAddr });
  } catch (error) {
    console.error("Error finding email", error);
    res.status(500).json({ message: "Error finding email" });
  }
};

exports.get_Feed = (req, res) => {
  res.render("feed");
};

exports.get_Calender = (req, res) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getDay();

  res.render("calender", {
    year: year,
    month: month,
    lastDay: lastDay,
    firstDayOfMonth: firstDayOfMonth,
    dayNames: dayNames,
  });
};
exports.get_Calender_currentData = (req, res) => {
  const today = new Date();
  let month = req.params.currentMonth;
  let year = req.params.currentYear;
  console.log(month, year);

  const lastDay = new Date(year, month, 0).getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  res.json({
    month: month,
    lastDay: lastDay,
    firstDayOfMonth: firstDayOfMonth,
    dayNames: dayNames,
  });
};

exports.get_Timer = (req, res) => {
  res.render("timer");
};

exports.get_MyPage = (req, res) => {
  res.render("myPage");
};

exports.post_Register = () => {
  res.render("register");
};
