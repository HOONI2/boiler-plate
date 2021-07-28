const express = require("express"); // Express 모듈을 가지고 온다
const app = express(); // 함수를 이용해서 새로운 Express App 을 만든다
const port = 5000; // 포트 지정

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
  .then(() => console.log("MongoDB Connect..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // 루트 디렉토리에서 문자열을 출력한다

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
