require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes";

let app = express();
//config parser body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors config
const cors = require("cors");
const corsOptions = {
  origin: process.env.CLIENT,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

viewEngine(app);
initWebRoutes(app);

const PORT = process.env.PORT || 6969;
const HOST = process.env.LOCAL_HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`App is running at the port ${PORT}`);
});
