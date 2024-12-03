require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../models");
const { where } = require("sequelize");
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
const salt = bcrypt.genSaltSync(10);

// Datastore chứa thông tin tạm của token khi user quên password
const Datastore = require("nedb-promises");
const forgotPasswordTokens = Datastore.create("ForgotPasswordTokenCustomer.db");

// Hàm điều hướng việc xác nhận có cập nhật mật khẩu
const postForgotPasswordService = async (email) => {
    try {
        // Kiểm tra xem email có tồn tại trong hệ thống không
        const customer = await db.customers.findOne({
            raw: true,
            where: { email: email },
        });

        if (!customer) {
            return { error: 4, message: "Email is not existed" };
        }

        // xoá token cũ
        const emailIsExisted = await forgotPasswordTokens.findOne({
            where: { email: email }
        })
        if (emailIsExisted) {
            await forgotPasswordTokens.remove({ email: email }, { multi: true });
        }

        // Tạo token ngẫu nhiên và thời gian hết hạn
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 phút
        const token = jwt.sign(
            { email: email, type: "password_reset" },
            process.env.API_SECRET_KEY,
            { subject: "forgotPasswordToken", expiresIn: "2m" } // Thời gian hết hạn 2 phút
        );

        // Lưu token và thời gian hết hạn vào cơ sở dữ liệu
        await forgotPasswordTokens.insert({
            forgotPasswordToken: token,
            resetPasswordExpires: expiresAt,
            email: email,
        });

        // Gửi email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.FE_PORT}/reset-password?token=${token}`;
        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Cập nhật mật khẩu",
            html: `
            <p>Nhấn vào nút dưới đây để xác nhận yêu cầu cập nhật mật khẩu:</p>
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">Xác nhận</a>
            <p>Liên kết này sẽ hết hạn sau 2 phút.</p>
          `,
        };

        await transporter.sendMail(emailOptions);

        return { error: 0, message: "Email xác nhận đã được gửi" };
    } catch (error) {
        console.error(">>> Service postForgotPasswordService ", error.message, error.stack);
        return { error: 3, message: `Đã xảy ra lỗi: ${error.message}` };
    }
};

// Hàm cập nhật mật khẩu khi xác nhận
const postResetPasswordService = async (token, password) => {
    const transaction = await db.sequelize.transaction(); // Khởi tạo transaction
    try {
        const decoded = jwt.verify(token, process.env.API_SECRET_KEY);
        // Kiểm tra xem email có tồn tại trong hệ thống không
        const customer = await db.customers.findOne({
            raw: true,
            where: { email: decoded.email },
        });

        if (!customer) {
            return { error: 4, message: "Nếu email tồn tại, bạn sẽ nhận được email xác nhận." };
        }

        // xoá token cũ
        const emailIsExisted = await forgotPasswordTokens.findOne({
            where: { email: decoded.email }
        })
        if (emailIsExisted) {
            console.log("xoa thanh cong");
            await forgotPasswordTokens.remove({ email: decoded.email }, { multi: true });
        }

        // Gửi email cap nhat thanh cong
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: decoded.email,
            subject: "Cập nhật mật khẩu thành công",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Updated Successfully</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    background-color: #4CAF50;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    color: #ffffff;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .email-body {
                    padding: 20px;
                    text-align: center;
                }
                .email-body p {
                    font-size: 16px;
                    color: #333333;
                    line-height: 1.5;
                }
                .email-footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888888;
                }
                .email-footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
                </style>
            </head>
            <body>
                <div class="email-container">
                <div class="email-header">
                    <h1>Đổi Mật Khẩu Thành Công</h1>
                </div>
                <div class="email-body">
                    <p>Xin chào,</p>
                    <p>Bạn đã thay đổi mật khẩu của mình thành công.</p>
                    <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ ngay với bộ phận hỗ trợ của chúng tôi.</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                </div>
                <div class="email-footer">
                    <p>Nếu bạn cần trợ giúp, vui lòng liên hệ <a href="mailto:support@example.com">support@example.com</a>.</p>
                </div>
                </div>
            </body>
            </html>
            `,
        };

        // Tìm tài khoản với email đã giải mã
        const accountCustomer = await db.accounts.findOne({
            where: { email: decoded.email },
            transaction // Áp dụng transaction
        });

        if (!accountCustomer) {
            // Nếu không tìm thấy tài khoản, rollback transaction
            await transaction.rollback();
            return { error: 4, message: "Account not found" };
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await hashPassword(password);
        accountCustomer.password = hashedPassword;

        // Lưu mật khẩu mới vào cơ sở dữ liệu
        await accountCustomer.save({ transaction });

        // Commit transaction sau khi tất cả thao tác thành công
        await transaction.commit();

        // Send to email
        await transporter.sendMail(emailOptions);
        return { error: 0, message: "Password được cập nhật thành công" };
    } catch (error) {
        // Check loi do jwt
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token invalid or expires' })
        }
        console.error(">>> Service postResetPasswordService ", error.message, error.stack);
        return { error: 3, message: "Đã xảy ra lỗi khi update mật khẩu customer" };
    }
}

const hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hash(password, salt);
            resolve(hash);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postForgotPasswordService,
    postResetPasswordService
}