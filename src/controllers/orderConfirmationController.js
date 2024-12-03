const { getOrdersService, updateStatusOrderService, updateStatusCancelOrderService, updateStatusReceivedOrderService } = require("../services/orderConfirmationService");

const getOrdersController = async (req, res) => {
    try {
        // Giả sử tìm thấy productID và trả về trong JSON
        const orders = await getOrdersService();
        if (orders.error === 3)
            return res.status(503).json(orders);
        if (orders.error === 4)
            return res.status(404).json(orders);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!", orders: [] });
    }
}

// Thực hiện confirm order
const updateStatusOrderController = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        // Kiểm tra nếu orderId không tồn tại
        if (!orderId && !status) {
            return res.status(400).json({ error: 'Order ID is required' });
        }
        switch (status) {
            case "confirm": {
                // Giả sử tìm thấy productID và trả về trong JSON
                const confirm = await updateStatusOrderService(orderId);
                if (confirm.error === 4)
                    return res.status(404).json(confirm);
                return res.status(200).json(confirm);
            }
            case "cancel": {
                // Giả sử tìm thấy productID và trả về trong JSON
                const cancel = await updateStatusCancelOrderService(orderId);
                if (cancel.error === 4)
                    return res.status(404).json(cancel);
                return res.status(200).json(cancel);
            }
            case "received": {
                // Giả sử tìm thấy productID và trả về trong JSON
                const cancel = await updateStatusReceivedOrderService(orderId);
                if (cancel.error === 4)
                    return res.status(404).json(cancel);
                return res.status(200).json(cancel);
            }
            default:
                console.log("Unknown status.");
                break;
        }
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!" });
    }
}

module.exports = {
    getOrdersController,
    updateStatusOrderController,
}