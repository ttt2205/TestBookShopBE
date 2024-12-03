import providerService from "../services/providerService";

const handleGetAll = async (req, res) => {
  try {
    let providers = await providerService.getAllProviders();
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
  handleGetAll,
};
