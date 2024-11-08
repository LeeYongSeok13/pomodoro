const db = require("../models/index");
const User = require("../models/index").User;
const Task = require("../models/index").Task;
const Timer = require("../models/index").Timer;
const Feed = require("../models/index").Feed;
const { Op } = require("sequelize");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const path = require("path");
const fs = require("fs");

require("dotenv").config();

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
const { log } = require("console");

const e = require("express");

// Multer 설정 (파일을 uploads/ 디렉터리에 저장)
const upload = multer({ dest: "uploads/" });

// s3 설정
const s3 = new S3Client({
  region : process.env.AWS_REGION,
  accessKeyId : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
});
// multer 세부 설정
const uploadDetail = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      // 파일이름에 uuid 설정
      // const ext = path.extname(file.originalname);
      const uniqueName = uuid() + path.extname(file.originalname);
      done(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  fileFilter(req, file, done) {
    // 확장자 검사
    // 정규표현식 업로드 허용된 파일 확장자 목록
    const allowedTypes = /jpeg|jpg|png|bmp/;
    // 파일의 확장자를 추출하는 코드
    // toLowerCase() 확장자를 소문자로 변환하여 대소문자 구분없이 검사 가능
    // JPG나 jpg
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // MIME 타입이 image/jpeg image/png 검사함
    // 조건이 맞으면 true 아니면 false
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return done(null, true);
    } else {
      return done(new Error("허용되지 않는 확장자 입니다."));
    }
  },
});
exports.get_modal = (req, res) => {
  res.send("example");
};

// 파일 s3에 업로드
const uploadToS3 = async (filePath, bucketName, keyName) => {
  try {
    // 업로드할 파일 경로 및 내용 준비
    const fileStream = fs.createReadStream(filePath);

    // s3에 업로드할 객체 설정
    const uploadParms = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileStream,
    };

    // s3에 파일 업로드
    const data = await s3.send(new PutObjectCommand(uploadParms));
    console.log("Success, file uploaded to S3", data);
    return `https://${bucketName}.s3.amazonaws.com/${keyName}`;
  } catch (err) {
    console.error("Error uploading file to S3", err);
    throw err; // 에러 처리
  }
};

exports.get_Index = async (req, res) => {
  // 세션 권한 없으면 login으로 가야함!!!
  // 처음 페이지 랜딩 시 피드 데이터 호출하기
  if (req.session.nickname) {
    try {
      const limit = 3;
      const offset = 0; // 첫 페이지에 대한 오프셋

      // 첫 페이지 피드 데이터 가져오기
      const feeds = await Feed.findAll({
        attributes : ['id', 'content','file_url','user_id'],
        include : [{
          model : require('../models/index').User,
          attributes : ['nickname'],
        }],
        order : [['created_at', 'DESC']],
        limit : limit,
        offset : offset
      });
      res.render("index", { feeds });
    } catch (error) {
      console.error('Error fetching initial feeds : ', error);
      res.status(500).send('Error loading initial page');
    }
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

  // 입력 값 검증
  if (!emailAddr || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 이메일로 사용자 검색
    const user = await User.findOne({ where: { emailAddr } });
    // 사용자가 존재하지 않거나 비밀번호가 틀린 경우
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호를 확인 해 주세요." });
    }

    // 로그인 성공
    req.session.userId = user.id; // 사용자 id값 저장
    req.session.nickname = user.nickname; // 로그인 성공 시 세션 설정
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging in" });
  }
};

exports.get_Register = async (req, res) => {
  res.render("register");
};

exports.post_Register = async (req, res) => {
  const {
    username,
    nickname,
    emailAddr,
    password,
    password_confirm,
    phoneNumber,
  } = req.body;

  const errors = {};

  // 비밀번호와 비밀번호 확인 값이 일치하는지 확인
  if (password !== password_confirm) {
    errors.password_confirm = "패스워드가 일치하지 않습니다.";
  }

  try {
    // 중복 검사
    const existingEmail = await User.findOne({ where: { emailAddr } });
    if (existingEmail) {
      errors.emailAddr = "이미 존재하는 이메일입니다.";
    }

    const existingNickname = await User.findOne({ where: { nickname } });
    if (existingNickname) {
      errors.nickname = "이미 존재하는 닉네임입니다.";
    }

    const existingPhoneNumber = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber) {
      errors.phoneNumber = "이미 존재하는 휴대전화 번호입니다.";
    }

    // 오류가 있으면 반환
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = await User.create({
      username,
      emailAddr,
      password: hashedPassword,
      nickname,
      phoneNumber,
    });

    return res.json({
      success: true,
      message: "Register successful",
      username: user.username, // 회원가입한 사람의 username을 반환
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.get_Find = (req, res) => {
  res.render("find");
};

exports.post_FindEmail = async (req, res) => {
  const { username, phoneNumber } = req.body;

  try {
    const user = await User.findOne({
      where: { username, phoneNumber },
    });

    if (!user) {
      // 이름이 틀린 경우
      const userByName = await User.findOne({ where: { username: username } });
      if (!userByName) {
        return res.status(404).json({ error: "username" });
      }

      // 전화번호가 틀린 경우
      const userByPhoneNumber = await User.findOne({ where: { phoneNumber } });
      if (!userByPhoneNumber) {
        return res.status(404).json({ error: "phoneNumber" });
      }

      // 이름과 전화번호가 모드 틀린 경우
      return res.status(404).json({ error: "mismatch" });
    }

    // 이름과 전화번호 모두 일치하면 이메일 반환
    return res.status(200).json({ emailAddr: user.emailAddr });
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

exports.get_modal = (req, res) => {
  res.render("modal");
};

exports.get_Feed = (req, res) => {
  res.render("feed");
};

// 피드 업로드
exports.post_feedUpload = (req, res) => {
  // multer 를 사용하여 파일 업로드
  // 문제해결
  // form 데이터를 가져왔을때 이미지와 본문 내용을 가져오면
  // 이미지 업로드를 먼저처리한뒤 body 값을 가져와야한다.
  // req bdoy 값을 먼저 가져오면 해당값이 비어있어 값을 가져오지 못하게 됨
  uploadDetail.single("file")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "file upload failed", details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { content } = req.body;
    // 세션에서 userId 값을 불러오기
    const { userId } = req.session;

    console.log(content);

    try {
      const filename = req.file.filename;
      const filePath = req.file.path;
      const bucketName = "feedimageup";
      const keyName = `images/${filename}`;

      // S3에 파일 업로드
      const fileUrl = await uploadToS3(filePath, bucketName, keyName);

      // db에 게시글 정보와 함꼐 파일 url 및 사용자의 id 저장
      const feedData = {
        content: content,
        file_url: fileUrl, // 컬럼명 수정
        user_id: userId, // user_id로 수정
      };

      // DB에 피드 데이터 저장
      const feed = await Feed.create(feedData);

      try {
        // 업로드 후 임시파일 삭제
        fs.unlinkSync(filePath);
      } catch (unlinkSync) {
        console.err("failed to delete file", unlinkErr);
      }

      //성공 응답
      res.status(200).json({ message: "feed uploaded success", fileUrl });
    } catch (err) {
      console.log("error during feed upload", err);
      res
        .status(500)
        .json({ error: "failed to upload feed", details: err.message });
    }
  });
};

// 피드 목록 가져오기 [ 페이징 ]
exports.get_Feeds = async (req, res) => {
  try {
    // 요청받은 페이지 정보
    const page = parseInt(req.query.page)
    console.log('전달받은 page값 : ', page);
    const limit = 3; // 한페이지에 보여줄 피드 개수
    const offset = (page - 1) * limit;

    

    // 피드 데이터 조회
    const feeds = await Feed.findAll({
      attributes : ['id','content','file_url','user_id'],
      include : [{
        model : require('../models/index').User,
        attributes : ['nickname'], // 유저 닉네임
      }],
      order : [['created_at','DESC']], // 최신 피드 순으로 정렬
      limit : limit, // 한 페이지에 3개 피드
      offset : offset // 페이지에 맞는 offset 적용
    });
    console.log(`Page: ${page}, Limit: ${limit}, Offset: ${offset}`);
    console.log('피드 데이터', feeds);

     // JSON 데이터 반환
     res.json(feeds);
  } catch (error) {
    console.error('Error fetching feeds :', error);
    res.status(500).json({message : 'Error fetching feeds'});
  }
}

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

  const { titles, description, state, todoid } = await get_today_todoList(
    req.session.nickname
  );

  res.render("calender", {
    year: year,
    month: month,
    lastDay: lastDay,
    firstDayOfMonth: firstDayOfMonth,
    dayNames: dayNames,
    titles: titles,
    description: description,
    state: state,
    todoid: todoid,
  });
};
exports.get_Timer = async (req, res) => {
  const { titles, description, state, todoid } = await get_today_todoList(
    req.session.nickname
  );

  res.render("timer", {
    titles: titles,
    description: description,
    state: state,
    todoid: todoid,
  });
};

exports.get_changeDate = async (req, res) => {
  const { year, month, day } = req.query;
  const user_id = req.session.nickname;
  console.log(year, month, day, user_id);

  // 클릭 연 월 일 필요
  const startOfDay = new Date(year, month, day);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(year, month, day);
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
  const titles = [];
  const description = [];
  const state = [];
  const todoid = [];

  todos.map((todo) => {
    titles.push(todo.title);
    description.push(todo.description);
    state.push(todo.state);
    todoid.push(todo.id);
  });

  // res.json({
  //   year: year,
  //   month: month,
  //   titles: titles,
  //   description: description,
  //   state: state,
  // });
  res.render("./shared/rotateTodoItem", {
    titles: titles,
    description: description,
    state: state,
    todoid: todoid,
  });
};

exports.get_Calender_currentData = (req, res) => {
  try {
    const today = new Date();
    let month = req.params.currentMonth;
    let year = req.params.currentYear;

    const lastDay = new Date(year, month, 0).getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    res.json({
      month: month,
      lastDay: lastDay,
      firstDayOfMonth: firstDayOfMonth,
      dayNames: dayNames,
    });
  } catch (error) {
    console.error(error);
  }
};
exports.delete_todo = async (req, res) => {
  try {
    const user_id = req.session.nickname;
    const { dataId } = req.body;
    await Task.destroy({
      where: {
        user_id: user_id,
        id: dataId,
      },
    });
    res.status(200).json({ delete: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ delete: false });
  }
};

exports.modify_todo = async (req, res) => {
  try {
    const { title, description, dataId } = req.body;
    await Task.update(
      { title: title, description: description },
      { where: { id: dataId } }
    );
    res.status(200).send("성공적으로 수정되었습니다.");
  } catch (error) {
    console.error(error);
    res.status(500).send("수정 중 오류가 발생했습니다.");
  }
};

exports.status_todo = async (req, res) => {
  try {
    const { status, id } = req.body;
    await Task.update({ state: status }, { where: { id: id } });
    res.status(200).send("성공적으로 수정되었습니다.");
  } catch (error) {
    console.error(error);
    res.status(500).send("상태 업데이트 중 오류가 발생했습니다.");
  }
};

exports.post_addtodo = async (req, res) => {
  try {
    const { title, description, year, month, today } = req.body;
    const specificDate = new Date(year, month - 1, today);
    const user_id = req.session.nickname;

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

exports.get_MyPage = async (req, res) => {
  const user_id = req.session.nickname;
  // 완료한 업무 검색
  const done_data = await Task.findAll({
    where: {
      user_id: user_id,
      state: "done",
    },
  });
  const done_titles = [];
  const done_descriptions = [];
  done_data.forEach((item) => {
    done_titles.push(item.dataValues.title);
    done_descriptions.push(item.dataValues.description);
  });

  // 미흡한 업무 검색
  const ongoing_data = await Task.findAll({
    where: {
      user_id: user_id,
      state: "ongoing",
    },
  });
  const ongoing_titles = [];
  const ongoing_descriptions = [];
  ongoing_data.forEach((item) => {
    ongoing_titles.push(item.dataValues.title);
    ongoing_descriptions.push(item.dataValues.description);
  });
  //미완료 업무 검색
  const pending_data = await Task.findAll({
    where: {
      user_id: user_id,
      state: "pending",
    },
  });
  const pending_titles = [];
  const pending_descriptions = [];
  pending_data.forEach((item) => {
    pending_titles.push(item.dataValues.title);
    pending_descriptions.push(item.dataValues.description);
  });
  // 모든 업무의 개수
  const allListNum =
    done_titles.length + ongoing_titles.length + pending_titles.length;

  // 업무 성공률
  const successPercentage = Math.round((done_titles.length / allListNum) * 100);
  res.render("myPage", {
    done_titles: done_titles,
    done_descriptions: done_descriptions,
    ongoing_titles: ongoing_titles,
    ongoing_descriptions: ongoing_descriptions,
    pending_titles: pending_titles,
    pending_descriptions: pending_descriptions,
    allListNum: allListNum,
    successPercentage: successPercentage,
  });
};

exports.get_modal = (req, res) => {
  res.send("example");
};

exports.getComponent = (req, res) => {
  const { title, description, dataId, state } = req.query;
  res.render("./shared/rotateTodoItem", {
    titles: title,
    description: description,
    todoid: dataId,
    state: state,
  });
};
// 타이머, 캘린더에서 표시할 오늘 일정 불러오는 함수(접어두고 사용)
async function get_today_todoList(nickname) {
  const user_id = nickname;

  // 오늘 0시부터 24시까지의 범위와 아이디로 일정을 탐색
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

  const titles = [];
  const description = [];
  const state = [];
  const todoid = [];

  todos.map((todo) => {
    titles.push(todo.title);
    description.push(todo.description);
    state.push(todo.state);
    todoid.push(todo.id);
  });
  return {
    titles,
    description,
    state,
    todoid,
  };
}
