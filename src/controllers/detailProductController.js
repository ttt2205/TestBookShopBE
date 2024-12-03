const { getDetailProductDataByIdService, getImagesForThumbnailService, getRelatedProductService, getGenreOfBookService } = require("../services/detailProductService");

const getDetailProductByID = async (req, res) => {
    try {
        const productID = req.query.id;
        // Kiểm tra nếu không có productID
        if (!productID) {
            return res.status(200).json({ error: 2, message: "Missing product id parameter", products: [] });
        }
        // Giả sử tìm thấy productID và trả về trong JSON
        const products = await getDetailProductDataByIdService(productID);
        if (products.error === 3)
            return res.status(503).json(products);
        if (products.error === 4)
            return res.status(404).json(products);
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!", products: [] });
    }
}

const getImagesForThumbnailController = async (req, res) => {
    try {
        const productID = req.query.id;
        // Kiểm tra nếu không có productID
        if (!productID) {
            return res.status(200).json({ error: 2, message: "Missing product id parameter", products: [] });
        }
        // Giả sử tìm thấy images và trả về trong JSON
        const images = await getImagesForThumbnailService(productID);
        if (images.error === 3)
            return res.status(503).json(images);
        if (images.error === 4)
            return res.status(404).json(images);
        return res.status(200).json(images);

    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!", products: [] });
    }
}

const getRelatedProductController = async (req, res) => {
    try {
        const { id, genreId } = req.query;
        if (!id || !genreId) {
            return res.status(200).json({ error: 2, message: "Missing product or genre id parameter", relatedProducts: [] });
        }
        const relatedProducts = await getRelatedProductService(id, genreId);
        if (relatedProducts.error === 3)
            return res.status(503).json(relatedProducts);
        if (relatedProducts.error === 4)
            return res.status(404).json(relatedProducts);
        return res.status(200).json(relatedProducts);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!", relatedProducts: [] });
    }
}

const getGenreOfBookController = async (req, res) => {
    try {
        const genres = await getGenreOfBookService();
        if (genres.error === 3)
            return res.status(503).json(genreOfBook);
        if (genres.error === 4)
            return res.status(404).json(genres);
        return res.status(200).json(genres);
    } catch (error) {
        return res.status(500).json({ error: 1, message: "Request is refused!", genres: [] });
    }
}

module.exports = {
    getDetailProductByID,
    getImagesForThumbnailController,
    getRelatedProductController,
    getGenreOfBookController
}