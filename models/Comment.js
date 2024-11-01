/**
 * feed 모델을 정의하는 함수
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */

const feed = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      feed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, // created_at과 update_at 자동생성
      createdAt: "created_at",
    }
  );
};
