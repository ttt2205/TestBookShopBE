const homeRouter = require("./home");
const authRouter = require("./auth");
const bookRouter = require("./book");
const detailProductRouter = require("./detailProduct");
const purchaseRouter = require("./purchase");
const providerRouter = require("./provider");
const accountRouter = require("./account");
const orderConfirmationRouter = require("./orderConfirmation");
const cartRouter = require("./cart");
const thongKeRouter = require("./thongke");
const orderRouter = require("./order");
const promotionRouter = require("./promotion");
const customerRouter = require("./customer");
const express = require("express");
const path = require("path");
const forgotPasswordRouter = require("./forgotPassword");

let initWebRoutes = (app) => {
  app.use("/", express.static(path.resolve(__dirname, "../../public")));
  app.use("/api/detail-product", detailProductRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/book", bookRouter);
  app.use("/api/purchase", purchaseRouter);
  app.use("/api/provider", providerRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order-confirmation", orderConfirmationRouter);
  app.use("/api/thongke", thongKeRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/customer", customerRouter);
  app.use("/api/forgot-password", forgotPasswordRouter);
  // app.use("/api/discount", discountRouter);
  app.use("/api/bill-promotion", billPromotionRouter);
  app.use("/api/promotion", promotionRouter);

  return app.use("/", homeRouter);
};

module.exports = initWebRoutes;
