import service from "../services/thongKeService.js";

const handleGetReceipts = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const receipts = await service.getReceipts(fromDate, toDate);
  res.json({
    receipts,
  });
};

const handleGetAccessLogs = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    let from = new Date(fromDate);
    let to = new Date(toDate);
    const dataSet = await service.getAccessLogs(from, to);
    res.status(200).json({
      dataSet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Get access logs failed",
      error: error.message,
    });
  }
};

const handleGetRevenueAndProfit = async (req, res) => {
  const { fromDate, toDate } = req.query;
  if (!fromDate || !toDate) {
    res.status(400).json({
      message: "Missing required fields",
    });
    return;
  }
  const data = await service.getRevenueAndProfit(fromDate, toDate);
  res.status(200).json({
    data,
  });
};

const handleGetSaleTrending = async (req, res) => {
  const { fromDate, toDate } = req.query;
  if (!fromDate || !toDate) {
    res.status(400).json({
      message: "Missing required fields",
    });
    return;
  }
  const data = await service.getSaleTrending(fromDate, toDate);
  res.status(200).json({
    data,
  });
};

export default {
  handleGetReceipts,
  handleGetAccessLogs,
  handleGetRevenueAndProfit,
  handleGetSaleTrending,
};
