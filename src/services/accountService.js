import db from "../models/index.js";

const getAllReferences = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let roles = await db.roles.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      resolve({ roles });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllReferences,
};
