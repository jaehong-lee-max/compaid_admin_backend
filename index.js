const express = require("express");
const sequelize = require("./config/database");
const User = require("./models/user");
const Notice = require("./models/notice");
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

// 공지사항 등록 API
app.post("/notice", async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = await Notice.create({ title, content });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 공지사항 목록 조회 API
app.get("/notice", async (req, res) => {
  try {
    const notice = await Notice.findAll();
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 공지사항 수정 API
app.put("/notice/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // 공지사항 업데이트
    await notice.update({ title, content });

    res.json({ message: "Notice updated successfully", notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
