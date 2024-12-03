import e from "cors";
import authService from "../services/authService";

let handleLogin = async (req, res) => {
  try {
    //get authentication token from client header
    let token = req.headers["authorization"];
    if (token) {
      let response = await authService.loginWithToken(token);
      return res.status(response.status).json({
        user: response.user,
        message: response.message,
        token: response.token,
      });
    }

    //get email and password from client request
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }
    let response = await authService.login(email, password);
    return res.status(response.status).json({
      user: response.user,
      token: response.token,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      tip: "Check database connection",
      error: error,
    });
  }
};

let handleRegister = async (req, res) => {
  try {
    let data = req.body;
    if (!data.email || !data.password || !data.username || !data.phoneNumber) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    } else {
      let message = await authService.register(data);
      return res.status(200).json({
        message: message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

let getUser = async (req, res) => {
  try {
    //get authentication token from client header
    let token = req.headers["authorization"];
    let user = await authService.getUserByToken(token);
    return res.status(200).json({
      message: "Authentication success",
      user: user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      error: error,
    });
  }
};

let authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    let user = await authService.getUserByToken(token);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

let checkAdmin = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    let user = await authService.getUserByToken(token);
    if (!user || user.role?.role_name !== "Admin") {
      return res.status(401).json({
        message: "Unauthorized, you are not an admin",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleRegister: handleRegister,
  getUser: getUser,
  authMiddleware: authMiddleware,
  checkAdmin: checkAdmin,
};
