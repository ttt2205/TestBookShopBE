import bcrypt, { hash } from "bcryptjs";
import db from "../models";
const salt = bcrypt.genSaltSync(10);

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

module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
};
