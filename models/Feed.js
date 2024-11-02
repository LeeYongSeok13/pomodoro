/**
 * feed 모델을 정의하는 함수
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */

const feed = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "feed",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(255),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // 현재 시간으로 기본값 설정
      },
    },
    {
      timestamps: true, // create_at과 update_at을 자동생성
      createdAt: "crated_at",
      updatedAt: "update_at",
    }
  );
};
