const { postForgotPasswordService, postResetPasswordService } = require("../services/forgotPasswordService");

const postForgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const respone = await postForgotPasswordService(email);
        if (respone.error === 4)
            return res.status(404).json(respone);
        if (respone.error === 3)
            return res.status(503).json(respone);
        return res.status(200).json(respone);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

const postResetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 1, message: "Missing required token or password" });
        }

        const respone = await postResetPasswordService(token, password);
        if (respone.error === 4)
            return res.status(404).json(respone);
        if (respone.error === 3)
            return res.status(503).json(respone);
        return res.status(200).json(respone);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

module.exports = {
    postForgotPasswordController,
    postResetPasswordController
}