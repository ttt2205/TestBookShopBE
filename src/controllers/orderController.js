import orderService from "../services/orderService";
const { getOrderByEmailService } = require("../services/orderService");

const handleGetPage = async (req, res) => {
  res.send("Get page");
};

const handleCreate = async (req, res) => {
  //   POST http://localhost:8080/api/order HTTP/1.1
  // Content-Type: application/json

  // {
  //   "customer_id": 1,
  //   "orderDetails": [
  //     {
  //       "book_id": 1,
  //       "quantity": 10
  //     },
  //     {
  //       "book_id": 2,
  //       "quantity": 10
  //     }
  //   ]
  // }
  try {
    let { customer_id, orderDetails, address } = req.body;
    if (!customer_id || !orderDetails || !address) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }

    let order = await orderService.createOrder(
      customer_id,
      orderDetails,
      address
    );
    return res.status(200).json({
      message: "Success",
      order: order || {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Create order failed",
      error: error.message,
    });
  }
};

const getOrderbyEmailController = async (req, res) => {
  try {
    const { email } = req.query;
    const respone = await getOrderByEmailService(email);
    if (respone.error === 4)
      return res.status(404).json(respone);
    if (respone.error === 3)
      return res.status(503).json(respone);
    return res.status(200).json(respone);
  } catch (error) {
    console.error(
      ">>> Service getOrderbyEmailController", "\nError:",
      error.message,
      "\nStack:",
      error.stack
    );
    return { error: 3, message: "Data connection failed" };
  }
}

module.exports = {
  handleGetPage,
  handleCreate,
  getOrderbyEmailController
};
