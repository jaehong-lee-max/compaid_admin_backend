const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FAQ = sequelize.define(
  "FAQ",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      // 작성자
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      // 질문 제목
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      // 질문 내용
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
    tableName: "faqs", // 테이블 이름 변경
    timestamps: false, // createdAt을 직접 설정하므로 timestamps 비활성화
  }
);

module.exports = FAQ;
