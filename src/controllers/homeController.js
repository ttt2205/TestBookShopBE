//***** EXAMPLE *******

import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser();
    console.log(data);
    return res.render("homepage.ejs", { users: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

let getInputPage = (req, res) => {
  return res.render("testInputFile.ejs");
};

let postInputPage = (req, res) => {
  if (req.files) {
    console.log(req.file);
    return res.send("Upload file successfully");
  }
  return res.send("Upload file failed");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  return res.send(message);
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log("data", data);

  return res.render("displayCRUD.ejs", { users: data });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);
    return res.render("editCRUD.ejs", {
      userData: userData,
    });
  } else {
    return res.send("User not found");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  console.log(data);
  let allUser = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", { users: allUser });
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let allUser = await CRUDService.deleteUserById(userId);
    return res.render("displayCRUD.ejs", { users: allUser });
  } else {
    return res.send("User not found");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getInputPage: getInputPage,
  postInputPage: postInputPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
