import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secretKey = process.env.API_SECRET_KEY;

const writeLog = async (account_id, action) => {
  if (action === "login") {
    //ghi log neu dang nhap lan dau tien trong ngay
    let log = await db.Log.findOne({
      where: {
        account_id: account_id,
        action: "login",
        createdAt: {
          [db.Sequelize.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    if (!log) {
      await db.Log.create({
        account_id: account_id,
        action: "login",
      });
    }
  }
};

let login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.accounts.findOne({
        include: [
          {
            model: db.roles,
            as: "role",
            attributes: ["role_name"],
          },
        ],
        where: { email: email, status: 1 },
      });
      if (user) {
        //check password
        let check = await bcrypt.compare(password, user.password);
        if (check) {
          // Generate a JWT token
          const token = jwt.sign(
            {
              account_id: user.account_id,
              username: user.username,
            },
            secretKey,
            { expiresIn: "1d" }
          );
          writeLog(user.account_id, "login");
          const { username, account_id, email, role, phone_number } = user;
          resolve({
            status: 200,
            message: "Login success",
            user: { username, account_id, email, role, phone_number },
            token: token,
          });
        } else {
          resolve({
            status: 200,
            message: "Wrong password",
          });
        }
      }
      resolve({
        status: 200,
        message: "Username is not exist or account is locked",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let register = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if email is already exist
      let user = await db.accounts.findOne({
        where: { email: data.email },
      });
      if (user) throw new Error("Email is already exist");
      let hashedPassword = await hashUserPassword(data.password);
      let newAccount = await db.accounts.create({
        email: data.email,
        password: hashedPassword,
        address: data.address,
        username: data.username,
        phone_number: data.phoneNumber,
        role_id: 3, //customer
        status: 1,
      });
      //tao customer
      await db.customers.create({
        email: data.email,
        firstName: "",
        lastName: "",
        address: data.address,
        phone_number: data.phoneNumber,
        account_id: newAccount.account_id,
      });
      resolve("Create new user success");
    } catch (error) {
      reject(error);
    }
  });
};

let getUserByToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.verify(token, secretKey);
      let user = await db.accounts.findOne({
        where: { account_id: decoded.account_id },
        include: [
          {
            model: db.roles,
            as: "role",
            attributes: ["role_name"],
          },
        ],
        attributes: ["account_id", "username", "email", "phone_number"],
      });
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let loginWithToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Verify token
      let decoded = jwt.verify(token, secretKey);
      if (decoded) {
        //if token is valid
        //find user by account_id
        let user = await db.accounts.findOne({
          where: { account_id: decoded.account_id, status: 1 },
          include: [
            {
              model: db.roles,
              as: "role",
              attributes: ["role_name"],
            },
          ],
        });
        if (!user) {
          reject({
            status: 200,
            message: "Account is locked",
          });
        }
        //create new token
        const newToken = jwt.sign(
          {
            account_id: decoded.account_id,
            username: decoded.username,
          },
          secretKey,
          { expiresIn: "1d" }
        );
        writeLog(user.account_id, "login");
        const { username, account_id, email, role, phone_number } = user;
        resolve({
          status: 200,
          message: "Login success",
          user: { username, account_id, email, role, phone_number },
          token: newToken,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedPassword = await hashUserPassword(user.password);
      await db.User.create({
        email: user.email,
        password: hashedPassword,
        firstName: user.firstname,
        lastName: user.lastname,
        address: user.address,
        phoneNumber: user.phonenumber,
        gender: user.gender === "1" ? true : false,
        roleId: user.roleId,
      });
      resolve("Create new user success");
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hash = await bcrypt.hash(password, salt);
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        raw: true,
        where: { id: userId },
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      user.firstName = data.firstname;
      user.lastName = data.lastname;
      user.address = data.address;
      user.phoneNumber = data.phonenumber;
      await user.save();
      let allUser = await db.User.findAll();
      resolve(allUser);
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
        let allUser = await db.User.findAll();
        resolve(allUser);
      } else {
        resolve("User not found");
      }
    } catch (error) {
      reject(error);
    }
  });
};
////
module.exports = {
  register,
  login: login,
  createNewUser: createNewUser,
  hashUserPassword: hashUserPassword,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
  getUserByToken: getUserByToken,
  loginWithToken: loginWithToken,
};
