import purchaseService from "../services/purchaseService";
import batchService from "../services/batchService";

const handleGetPage = async (req, res) => {
  try {
    let page = req.query.page || 1;
    page = parseInt(page);
    let limit = req.query.limit || 10;
    limit = parseInt(limit);
    let query = req.query.q || "";
    let searchBy = req.query.searchBy || "all";
    let orderBy = req.query.orderBy || "createdAt";
    let orderType = req.query.orderType || "desc";
    let startDate = req.query.startDate || "";
    let endDate = req.query.endDate || "";
    let startTotal = req.query.startTotal || "0";
    let endTotal = req.query.endTotal || "";
    let provider_id = req.query.provider_id || "";
    let { receipts, total_page } = await purchaseService.getPage(
      page,
      limit,
      query,
      searchBy,
      orderBy,
      orderType,
      startDate,
      endDate,
      startTotal,
      endTotal,
      provider_id
    );
    return res.status(200).json({
      message: "Success",
      receipts: receipts || [],
      total_page: total_page || 0,
      page: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Get receipt failed",
      error: error.message,
    });
  }
};

const handleGetById = async (req, res) => {
  try {
    let id = req.params.receiptId;
    if (!id) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }
    let receipt = await purchaseService.getReceiptById(id);
    return res.status(200).json({
      message: "Success",
      receipt: receipt || {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Get receipts failed",
      error: error.message,
    });
  }
};

const handleCreate = async (req, res) => {
  try {
    let data = req.body;
    if (!data.purchaseDetails || !data.provider_id) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }
    //sau nay chac de client tinh toan
    let total = data.purchaseDetails.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
    // mac dinh se tao batch moi khi tao receipt, sau nay se nang cap thanh nhap ca ma lo hang
    let details = data.purchaseDetails.map((item) => {
      return {
        book_id: item.book_id,
        stock_quantity: item.quantity,
        price: item.price,
      };
    }); //item = {book_id, quantity, price}

    let provider_id = parseInt(data.provider_id);
    let receipt = await purchaseService.createReceipt({
      total,
      provider_id,
      details: details,
    });
    return res.status(200).json({
      message: "Success",
      receipt: receipt || {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Create receipt failed",
      error: error.message,
    });
  }
};

const handleGetAllProviders = async (req, res) => {
  try {
    let providers = await purchaseService.getAllProviders();
    return res.status(200).json({
      message: "Success",
      providers: providers || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Get providers failed",
      error: error.message,
    });
  }
};

module.exports = {
  handleGetPage,
  handleGetById,
  handleCreate,
  handleGetAllProviders,
};
