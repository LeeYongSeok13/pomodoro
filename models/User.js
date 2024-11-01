/**
 * user 모델을 정의하는 함수
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */

const user = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      real_name: {
        // 본인 이름
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nickname: {
        // 닉네임
        type: DataTypes.VARCHAR(255),
        allowNull: false,
        unique: true, // 닉네임 중복 불가 설정
      },
      emailAddr: {
        type: DataTypes.VARCHAR(255),
        allowNull: false,
        unique: true, // 이메일 중복 불가 설정
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.VARCHAR(255),
        allowNull: false,
      },
      phoneNumber: {
        type: DataType.VARCHAR(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // 현재 시간으로 기본값 설정
      },
      update_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true, // created_at과 update_at을 자동 생성
      createdAt: "created_at",
      updatedAt: "update_at",
    }
  );
};

module.exports = user;
