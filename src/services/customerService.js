const { where } = require("sequelize");
import bcrypt, { hash } from "bcryptjs";
import db from "../models";
import { raw } from "body-parser";
const salt = bcrypt.genSaltSync(10);


const postRegisterCustomerService = async (customerInfo) => {
    try {
        // Kiểm tra email customer có tồn tại ?
        const existingCustomer = await db.customers.findOne({
            where: {
                email: customerInfo.email
            }
        })
        if (existingCustomer) {
            return { error: 4, message: "Email is existed" };
        }
        console.log(">>> test1")
        const transaction = await db.sequelize.transaction();
        // Thực hiện tạo account customer
        const accountCustomer = await db.accounts.create({
            username: customerInfo.firstname,
            password: await hashUserPassword(customerInfo.password),
            email: customerInfo.email,
            phone_number: customerInfo.phone_number,
            role_id: 3, // 3 là của customer
            status: 1,
            last_login: null,
        }, { transaction })
        console.log(">>> test2")

        if (accountCustomer) {
            const customer = await db.customers.create({
                firstName: customerInfo.firstname,
                lastName: customerInfo.lastname,
                email: customerInfo.email,
                phone_number: customerInfo.phone_number,
                account_id: accountCustomer.account_id
            }, { transaction })
        }
        console.log(">>> test3")

        await transaction.commit();
        return { error: 0, message: "Registration successful" };
    } catch (error) {
        console.error(">>> Service postRegisterCustomerService Error:", error.message, "\nStack:", error.stack);
        return { error: 3, message: "Data connection failed" };
    }
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

const getCustomerInfoService = async (email) => {
    try {
        const customer = await db.customers.findOne({
            raw: true,
            where: { email: email }
        });
        if (!customer) {
            return { error: 4, message: "Customer is not found" };
        }
        return { error: 0, message: "Get customer info succeed", customer: customer };
    } catch (error) {
        console.error(">>> Service getCustomerInfoService Error:", error.message, "\nStack:", error.stack);
        return { error: 3, message: "Data connection failed" };
    }
}

const updateCustomerInfoService = async (data) => {
    const transaction = await db.sequelize.transaction(); // Khởi tạo transaction
    try {
        const { firstname, lastname, email, phoneNumber } = data;

        // Tìm khách hàng trong cơ sở dữ liệu
        const customer = await db.customers.findOne({
            where: { email: email },
            transaction: transaction, // Gắn transaction vào query
        });

        // Kiểm tra nếu khách hàng không tồn tại
        if (!customer) {
            await transaction.rollback(); // Hủy transaction
            return { error: 4, message: "Customer is not found" };
        }

        // Cập nhật thông tin khách hàng
        customer.firstName = firstname;
        customer.lastName = lastname;
        customer.phone_number = phoneNumber;

        // Lưu thay đổi vào cơ sở dữ liệu
        await customer.save({ transaction });

        // Commit transaction sau khi thành công
        await transaction.commit();

        return {
            error: 0,
            message: "Customer information updated successfully",
            customer: customer,
        };
    } catch (error) {
        // Rollback nếu có lỗi
        await transaction.rollback();
        console.error(
            ">>> Service updateCustomerInfoService Error:",
            error.message,
            "\nStack:",
            error.stack
        );
        return { error: 3, message: "Data connection failed" };
    }
};

module.exports = {
    postRegisterCustomerService,
    getCustomerInfoService,
    updateCustomerInfoService,
}