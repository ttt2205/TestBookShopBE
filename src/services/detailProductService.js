const { where, Op } = require("sequelize");
const db = require("../models");
import Sequelize, { or } from "sequelize";
const baseUrl = `http://${process.env.HOSTNAME}/img/`;

const getDetailProductDataByIdService = async (productID) => {
    try {
        const products = await db.books.findOne({
            include: include,
            attributes: attributes,
            where: {
                book_id: productID,
            },
        });
        if (!products) {
            return { error: 4, message: "Product is not found", products: [] };
        }
        return { error: 0, message: "Get data product succeed", products: products }; // Trả về sản phẩm
    } catch (error) {
        console.error(">>> Service getDetailProductDataByID ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful", products: [] };
    }
}

const include = [
    {
        model: db.bookimages,
        as: "image",
        attributes: [
            [
                db.sequelize.fn("CONCAT", baseUrl, db.sequelize.col("image.url")),
                "url",
            ],
            "is_main",
            "bookImage_id",
        ],
        where: { is_main: 1 },
        required: false,
    },
    {
        model: db.bookimages,
        as: "alt_images",
        attributes: [
            [db.sequelize.fn("CONCAT", baseUrl, db.sequelize.col("url")), "url"],
            "is_main",
            "bookImage_id",
        ],
        where: { is_main: 0 },
        required: false,
        separate: true,
    },
    {
        model: db.genres,
        as: "genre",
        attributes: ["name"],
    },
    {
        model: db.languages,
        as: "language",
        attributes: ["language_name", "language_code"],
    },
    {
        model: db.publishers,
        as: "publisher",
        attributes: ["name"],
    },
    {
        model: db.discounts,
        as: "discounts",
        through: { attributes: [] },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
        where: {
            end_at: {
                [Sequelize.Op.gte]: new Date(),
            },
            start_at: {
                [Sequelize.Op.lte]: new Date(),
            },
        },
        required: false,
    },
    {
        model: db.authors,
        as: "authors",
        attributes: ["name", "author_id"],
        through: { attributes: [] },
    },
    {
        model: db.bookstatus,
        as: "status",
        attributes: ["status_name"],
    },
    {
        model: db.coverformats,
        as: "coverFormat",
        attributes: ["name"],
    },
    {
        model: db.batches,
        as: "stock",
        attributes: {
            exclude: ["updatedAt"],
        },
        where: {
            stock_quantity: {
                [Sequelize.Op.gt]: 0,
            },
        },
        required: false,
    },
];

const attributes = {
    include: [
        [
            Sequelize.literal(
                "(SELECT SUM(stock_quantity) FROM batches WHERE batches.book_id = books.book_id)"
            ),
            "stock_quantity", // Đặt alias cho kết quả của subquery
        ],
    ],
    exclude: ["createdAt", "updatedAt"],
};



const getImagesForThumbnailService = async (productID) => {
    try {
        const images = await db.bookimages.findAll({
            where: { book_id: Number(productID) },
            attributes: {
                include: [
                    [
                        db.sequelize.fn("CONCAT", baseUrl, db.sequelize.col("url")),
                        "url"
                    ],
                    "is_main",
                    "bookImage_id"
                ],
                exclude: ["createdAt", "updatedAt"]
            }
        });
        if (!images) {
            return { error: 4, message: "Images is not found", images: [] };
        }
        return { error: 0, message: "Get data images succeed", images: images };
    } catch (error) {
        console.error(">>> Service getImagesForThumbnailService ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful", images: [] };
    }
}

// const formattedProduct = (products) => {
//     return ({
//         id: products.book_id,
//         title: products.title, // Giả sử bạn có thuộc tính title
//         genreId: products.genre_id,
//         publisher: products.publisher.name || 'N/A', // Lấy tên nhà xuất bản
//         publisherYear: products.publication_year || 'N/A',
//         stock: products.stock_quantity || 0,
//         weight: products.weight || 'N/A',
//         size: products.size || 'N/A',
//         numPage: products.num_page || 'N/A',
//         salePrice: products.price_receipt || 0,
//         discountValue: products.discount || 0,
//         description: products.decription || "",
//         authors: products.bookauthors.map(ba => ({
//             id: ba.author.author_id,
//             name: ba.author.name // Lấy tên tác giả
//         })),
//         goodsReceipts: products.goodsreceiptdetails.map(detail => ({
//             quantity: detail.quantity,
//             price: detail.price,
//             subtotal: detail.subtotal,
//             receiptId: detail.receipt_id,
//             provider: detail.receipt.provider?.name || "N/A",
//         }))
//     });
// }

const getRelatedProductService = async (productId, genreId) => {
    try {
        const relatedProducts = await db.books.findAll({
            where: { book_id: { [Op.not]: productId }, genre_id: genreId },
            include: [{
                model: db.discounts,
                as: "discounts"
            }, {
                model: db.bookimages,
                as: "alt_images",
                attributes: [
                    [db.sequelize.fn("CONCAT", baseUrl, db.sequelize.col("url")), "url"],
                    "is_main",
                    "bookImage_id",
                ],
                where: { is_main: 1 }
            }]
        });
        if (!relatedProducts || relatedProducts.length === 0) {
            return { error: 4, message: "Related products not found", relatedProducts: [] };
        }
        return { error: 0, message: "Get data for related products succeeded", relatedProducts };
    } catch (error) {
        console.error(">>> Service getRelatedProductService Error:", error.message, "\nStack:", error.stack);
        return { error: 3, message: "Data connection failed", relatedProducts: [] };
    }
};

const getGenreOfBookService = async () => {
    try {
        const genres = await db.genres.findAll({
            attributes: {
                exclude: ["createAt", "updateAt"]
            }
        });
        if (!genres || genres.length === 0) {
            return { error: 4, message: "Genre not found", genres: [] };
        }
        return { error: 0, message: "Get data for Genre succeeded", genres };
    } catch (error) {
        console.error(">>> Service getGenreOfBookService Error:", error.message, "\nStack:", error.stack);
        return { error: 3, message: "Data connection failed" };
    }
};

module.exports = {
    getDetailProductDataByIdService,
    getImagesForThumbnailService,
    getRelatedProductService,
    getGenreOfBookService
}