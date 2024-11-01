/**
 * task 모델을 정의하는 함수
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */

const task = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM("pending", "ongoing", "done"),
        defaultValue: "pending",
      },
      duration: {
        // 각 할일의 걸린 시간을 초 단위로 저장
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      update_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, // create_at과 update_at을 자동생성
      createdAt: "crated_at",
      updatedAt: "update_at",
    }
  );
};

module.exports = task;
