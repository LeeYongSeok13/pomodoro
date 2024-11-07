const db = require("../models/index");
const User = require("../models/index").User;
const Task = require("../models/index").Task;
const Timer = require("../models/index").Timer;
const Feed = require("../models/index").Feed;
const { Op } = require("sequelize");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');

require('dotenv').config();

console.log('feed', Feed);
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
  limits : { fileSize: 5 * 1024 * 1024 }, //5MB
  fileFilter(req, file, done) {
    // 확장자 검사
    // 정규표현식 업로드 허용된 파일 확장자 목록
    const allowedTypes = /jpeg|jpg|png|bmp/;
    // 파일의 확장자를 추출하는 코드
    // toLowerCase() 확장자를 소문자로 변환하여 대소문자 구분없이 검사 가능
    // JPG나 jpg
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // MIME 타입이 image/jpeg image/png 검사함
    // 조건이 맞으면 true 아니면 false
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return done(null, true);
    } else {
      return done(new Error('허용되지 않는 확장자 입니다.'));
    }
  }
});

// 파일 s3에 업로드
const uploadToS3 = async (filePath, bucketName, keyName) => {
  try {
    // 업로드할 파일 경로 및 내용 준비
    const fileStream = fs.createReadStream(filePath);

    // s3에 업로드할 객체 설정
    const uploadParms = {
      Bucket : bucketName,
      Key : keyName,
      Body : fileStream
    };

    // s3에 파일 업로드
    const data = await s3.send(new PutObjectCommand(uploadParms));
    console.log("Success, file uploaded to S3", data);
    return `https://${bucketName}.s3.amazonaws.com/${keyName}`;
  } catch (err) {
    console.error("Error uploading file to S3", err);
    throw err; // 에러 처리
  }
}

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
  const { id,emailAddr, password } = req.body;
  console.log("post_login",req.body);

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
    req.session.userId = user.id; // 사용자 id값 저장
    req.session.nickname = user.nickname; // 로그인 성공 시 세션 설정
    console.log("세션에 저장된 userId:", req.session.userId);
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

// 피드 업로드
exports.post_feedUpload = (req,res) => {
    // multer 를 사용하여 파일 업로드
    // 문제해결
    // form 데이터를 가져왔을때 이미지와 본문 내용을 가져오면
    // 이미지 업로드를 먼저처리한뒤 body 값을 가져와야한다.
    // req bdoy 값을 먼저 가져오면 해당값이 비어있어 값을 가져오지 못하게 됨
    uploadDetail.single('file')(req,res, async(err) => {
      if (err) {
        return res.status(400).json({ error : "file upload failed",details : err.message});
      }

      if(!req.file) {
        return res.status(400).json({ error : "No file uploaded" });
      }

      const { content } = req.body;
      // 세션에서 userId 값을 불러오기
      const { userId } = req.session;

      console.log(content);
      

      try {
        const filename = req.file.filename;
        const filePath = req.file.path;
        const bucketName = "feedimageup"
        const keyName = `images/${filename}`;

        // S3에 파일 업로드
        const fileUrl = await uploadToS3(filePath,bucketName,keyName);

        // db에 게시글 정보와 함꼐 파일 url 및 사용자의 id 저장
        const feedData = {
          content : content,
          file_url: fileUrl,  // 컬럼명 수정
          user_id: userId  // user_id로 수정
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
        res.status(200).json({message : "feed uploaded success", fileUrl});
      } catch (err) {
        console.log("error during feed upload", err);
        res.status(500).json({ error : "failed to upload feed", details : err.message});
      }
    });
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
  res.render("timer");
};

exports.get_MyPage = (req, res) => {
  res.render("myPage");
};

exports.get_modal = (req, res) => {
  res.send("example");
};