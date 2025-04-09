const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const User = require("./models/user");
const Notice = require("./models/notice");
const FAQ = require("./models/faq");
const Comment = require("./models/comment");

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());

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

////////// 공지사항 api

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

    await notice.update({ title, content });

    res.json({ message: "Notice updated successfully", notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

////////// FAQ api

// 질문 생성 API
app.post("/faqs", async (req, res) => {
  try {
    const { author, title, content } = req.body;
    const faq = await FAQ.create({ author, title, content });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 질문 목록 조회 API
app.get("/faqs", async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 질문 조회 (댓글 포함)
app.get("/faqs/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id, {
      include: {
        model: Comment,
        as: "comments",
        include: { model: Comment, as: "replies" },
      },
    });
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 질문 수정 API
app.put("/faqs/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    const { title, content } = req.body;
    await faq.update({ title, content });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 질문 삭제 API
app.delete("/faqs/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    await faq.destroy();
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

////////// 댓글 (답변) 관련 API

// 댓글 생성 API
app.post("/comments", async (req, res) => {
  try {
    const { faqId, parentId, author, content } = req.body;
    const faq = await FAQ.findByPk(faqId);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    const comment = await Comment.create({ faqId, parentId, author, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 질문의 댓글 조회 API (대댓글 포함)
app.get("/comments/:faqId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { faqId: req.params.faqId },
      include: { model: Comment, as: "replies" },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 댓글 수정 API
app.put("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const { content } = req.body;
    await comment.update({ content });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 댓글 삭제 API
app.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.destroy();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
