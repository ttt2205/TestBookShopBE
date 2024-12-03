import db from "../models/index";

const getAllProviders = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let providers = await db.providers.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      resolve(providers);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllProviders,
};
