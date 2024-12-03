const { postRegisterCustomerService, getCustomerInfoService, updateCustomerInfoService } = require("../services/customerService");

const registerCustomerController = async (req, res) => {
    try {
        const customerInfo = req.body;
        console.log(">>> customerInfo", customerInfo)
        if (!customerInfo) {
            return res.status(200).json({ error: 2, message: "Missing customerInfo parameter" });
        }
        console.log(">>> start")
        const resRegister = await postRegisterCustomerService(customerInfo);
        console.log(">>> end")
        // Lỗi liên quan đến database
        if (resRegister.error === 3) {
            return res.status(503).json(resRegister);
        }
        // Email đã tồn tại
        if (resRegister.error === 4) {
            return res.status(409).json(resRegister);
        }
        return res.status(200).json(resRegister)
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

const getCustomerInfoController = async (req, res) => {
    try {
        const { email } = req.query; // Nhận email từ URL params
        const token = req.get('Authorization'); // Lấy token từ header Authorization
        if (!email)
            return res.status(400).json({ error: 1, message: "Email query parameter is required" });
        const resCustomer = await getCustomerInfoService(email);
        if (resCustomer.error === 4)
            return res.status(404).json(resCustomer);
        if (resCustomer.error === 3)
            return res.status(503).json(resCustomer);
        return res.status(200).json(resCustomer);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

const updateCustomerInfoController = async (req, res) => {
    try {
        const data = req.body; // Nhận email từ URL params
        if (!data)
            return res.status(400).json({ error: 1, message: "Data customer info is required" });
        const resCustomer = await updateCustomerInfoService(data);
        if (resCustomer.error === 4)
            return res.status(404).json(resCustomer);
        if (resCustomer.error === 3)
            return res.status(503).json(resCustomer);
        return res.status(200).json(resCustomer);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

module.exports = {
    registerCustomerController,
    getCustomerInfoController,
    updateCustomerInfoController,
}