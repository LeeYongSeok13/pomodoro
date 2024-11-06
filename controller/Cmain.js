const db = require("../models/index");
const User = require("../models/index").User;
const Task = require("../models/index").Task;
const Timer = require("../models/index").Timer;
const { Op } = require("sequelize");

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
exports.get_modal = (req, res) => {
  res.send("example");
};

exports.get_Index = (req, res) => {
  // 세션 권한 없으면 login으로 가야함!!!
  if (req.session.nickname) {
    res.render("index");
  } else {
    // 데이터 구현시 index 대신 login 넣기!!!
    res.redirect("/login");
  }
};

exports.get_Login = (req, res) => {
  res.render("login");
};

exports.post_Login = async (req, res) => {
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
    req.session.nickname = user.nickname; // 로그인 성공 시 세션 설정
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
    const existingEmail = await User.findOne({ where: { emailAddr } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exist" });
    }

    // 닉네임 중복 확인
    const existingNickname = await User.findOne({ where: { nickname } });
    if (existingNickname) {
      return res.status(409).json({ message: "Nickname already exist" });
    }

    // 휴대전화 번호 중복 확인
    const existingPhoneNumber = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber) {
      return res.status(409).json({ message: "PhoneNumber already exist" });
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

exports.post_FindEmail = async (req, res) => {
  const { username, phoneNumber } = req.body;

  try {
    // 이름과 전화번호로 사용자 검색
    const user = await User.findOne({
      where: {
        username,
        phoneNumber,
      },
    });

    if (user) {
      // 사용자가 있으면  반환
      res.status(200).json({ emailAddr: user.emailAddr });
    } else {
      // 사용자가 없으면 404 상태코드 응답
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

exports.post_ResetPassword = async (req, res) => {
  const { username, phoneNumber, emailAddr } = req.body;

  try {
    // 이름, 전화번호, 이메일로 비밀번호 재설정
    const user = await User.findOne({
      where: {
        username,
        phoneNumber,
        emailAddr,
      },
    });

    if (user) {
      if (user.emailAddr !== emailAddr) {
        return res.status(404).json({ message: "이메일이 일치하지 않습니다." });
      }
      // 사용자가 있으면 비밀번호 재설정 링크 반환 (모달 처리)
      res.status(200).json({ message: "사용자를 찾았습니다.", id: user.id });
    } else {
      // 사용자가 없으면 404 상태코드 응답
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

exports.update_Passowrd = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // 비밀번호 해싱 처리
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 사용자 비밀번호 업데이트
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "비밀번호 변경에 실패했습니다." });
  }
};

exports.get_Feed = (req, res) => {
  res.render("feed");
};

exports.get_Calender = async (req, res) => {
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
  const user_id = req.session.nickname;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todos = await Task.findAll({
    where: {
      user_id: user_id,
      due_date: {
        [Op.gte]: startOfDay, // 시작일 이후
        [Op.lte]: endOfDay, // 종료일 이전
      },
    },
  });

  const titles = todos.map((todo) => todo.title);
  const description = todos.map((todo) => todo.description);
  const state = todos.map((todo) => todo.state);

  todos.forEach((todo) => {
    console.log(todo.dataValues); // 각 todo의 실제 값 출력
  });

  res.render("calender", {
    year: year,
    month: month,
    lastDay: lastDay,
    firstDayOfMonth: firstDayOfMonth,
    dayNames: dayNames,
    titles: titles,
    description: description,
    state: state,
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
exports.post_addtodo = async (req, res) => {
  try {
    const { title, description, year, month, today } = req.body;
    const specificDate = new Date(year, month - 1, today);
    const user_id = req.session.nickname;
    console.log(specificDate.toString());

    const newtask = await Task.create({
      user_id,
      title,
      description,
      due_date: specificDate,
    });

    res.status(201).json(newtask);
  } catch (error) {
    console.error(error);
  }
};

exports.get_Timer = (req, res) => {
  const todoItems = [
    { title: "Task 1", description: "Description for task 1" },
    { title: "Task 2", description: "Description for task 2" },
    // 추가할 항목들
  ];

  res.render("timer", { todoItems });
};

exports.get_MyPage = (req, res) => {
  res.render("myPage");
};
