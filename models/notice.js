const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      // 공지사항 제목
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      // 공지사항 내용
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      // 게시 날짜 (자동 생성)
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notices", // 테이블 이름 변경
    timestamps: false, // createdAt을 직접 설정하므로 timestamps 비활성화
  }
);

module.exports = Notice;
