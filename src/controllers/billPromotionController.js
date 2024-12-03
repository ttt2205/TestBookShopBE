// import promotionService from "../services/promotionService.js";

// const handleGetPage = async (req, res) => {
//   let { page, limit, query, searchType, sortBy } = req.query;
//   page = parseInt(page) || 1;
//   limit = parseInt(limit) || 10;
//   query = query || "";
//   searchType = searchType || "all";
//   sortBy = sortBy || "billPromotion_id";
//   try {
//     let { promotions, total_page } = await promotionService.getPage(
//       page,
//       limit,
//       query,
//       searchType,
//       sortBy
//     );
//     return res.status(200).json({
//       message: "Success",
//       promotions: promotions || [],
//       total_page: total_page || 0,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const handleCreate = async (req, res) => {
//   const { promotion } = req.body;
//   try {
//     await promotionService.create(promotion);
//     return res.status(200).json({
//       message: "Create promotion successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const handleUpdate = async (req, res) => {
//   const billPromotion_id = req.params.id;
//   const { promotion } = req.body;
//   try {
//     await promotionService.update(billPromotion_id, promotion);
//     return res.status(200).json({
//       message: "Update promotion successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   handleGetPage,
//   handleCreate,
//   handleUpdate,
// };
