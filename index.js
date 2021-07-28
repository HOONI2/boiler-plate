const express = require("express"); // Express 모듈을 가지고 온다
const app = express(); // 함수를 이용해서 새로운 Express App 을 만든다
const port = 5000; // 포트 지정

const bodyParser = require("body-parser"); // body 부분에 날아오는 데이터를 받기 위해서 필요(User.js에서 설정한 key, value)
const { User } = require("./models/User"); // User.js 형식 받아옴
//application/x-www-form-urlencoded, express 최신버전에서는 npm 으로 깔지않아도 기본적으로 지원되므로 줄이 생김
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://root:root123@boilerplate.hbgju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connect...")) // 성공했을시에 콘솔에 출력
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // 루트 디렉토리에서 문자열을 출력한다

app.post("/register", (req, res) => {
  // 회원가입 할때 필요한 정보들을 clien에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.bdoy);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      //status(200) 성공했을 때를 의미
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
