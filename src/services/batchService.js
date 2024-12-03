const createBatch = async (batch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newBatch = await db.batches.create(batch);
      resolve(newBatch);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBatches = async (bookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let batches = await db.batches.findAll({
        where: { book_id: bookId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      resolve(batches);
    } catch (error) {
      reject(error);
    }
  });
};

const getBatch = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let batch = await db.batches.findOne({
        where: { batch_id: id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      resolve(batch);
    } catch (error) {
      reject(error);
    }
  });
};

const updateBatch = async (batch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updatedBatch = await db.batches.update(batch, {
        where: { batch_id: batch.batch_id },
      });
      resolve(updatedBatch);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBatch,
  getAllBatches,
  getBatch,
  updateBatch,
};
