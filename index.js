const express = require("express"); // Express 모듈을 가지고 온다
const app = express(); // 함수를 이용해서 새로운 Express App 을 만든다
const bodyParser = require("body-parser"); // body 부분에 날아오는 데이터를 받기 위해서 필요(User.js에서 설정한 key, value)
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User"); // User.js 형식 받아옴

//application/x-www-form-urlencoded, express 최신버전에서는 npm 으로 깔지않아도 기본적으로 지원되므로 줄이 생김
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...")) // 성공했을시에 콘솔에 출력
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World! 새해 복 많이 받으세요")); // 루트 디렉토리에서 문자열을 출력한다

app.post("/register", (req, res) => {
  // 회원가입 할때 필요한 정보들을 clien에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다 어디에? 쿠키, 로컬스토리지, 세션
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
const port = 5000; // 포트 지정
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
