const express = require("express");
const sequelize = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// DB 연결 및 테이블 생성
sequelize
  .sync({ force: false }) // `force: true` 하면 기존 테이블 삭제 후 재생성됨
  .then(() => console.log("Database connected & tables synchronized"))
  .catch((err) => console.error("DB Connection Error:", err));

// 기본 API 엔드포인트
app.get("/", (req, res) => {
  res.send("Hello, Express with MySQL!");
});

// 사용자 등록 API
app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.create({ username, email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 사용자 목록 조회 API
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
