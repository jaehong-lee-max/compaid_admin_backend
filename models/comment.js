const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const FAQ = require("./faq");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    faqId: {
      // 질문 ID (외래키)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: FAQ, key: "id" },
    },
    parentId: {
      // 부모 댓글 ID (대댓글)
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "comments", key: "id" },
    },
    author: {
      // 작성자
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      // 댓글 내용
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      // 생성 날짜 (자동 생성)
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "comments", // 테이블명 명시
    timestamps: false, // createdAt을 직접 설정하므로 timestamps 비활성화
  }
);

// 관계 설정
FAQ.hasMany(Comment, { foreignKey: "faqId", onDelete: "CASCADE" });
Comment.belongsTo(FAQ, { foreignKey: "faqId" });

Comment.hasMany(Comment, {
  foreignKey: "parentId",
  as: "replies",
  onDelete: "CASCADE",
});
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

module.exports = Comment;
