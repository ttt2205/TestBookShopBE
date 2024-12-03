const bookService = require("../services/bookService");
const imageService = require("../services/imageService");

let handleGetById = async (req, res) => {
  try {
    let id = req.params.bookId;
    if (!id) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }
    let { book } = await bookService.getBookById(id);
    return res.status(200).json({
      message: "Success",
      book: book,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get book failed",
      error: error.message,
    });
  }
};

let handleGetPage = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let searchBy = req.query.type || "all";
    let query = req.query.q || "";
    let sortBy = req.query.sortBy || "book_id";
    let sortType = req.query.sortType || "asc";
    let { books, total_page } = await bookService.getPage(
      page,
      limit,
      searchBy,
      query,
      sortBy,
      sortType
    );
    return res.status(200).json({
      message: "Success",
      books: books || [],
      total_page: total_page || 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get book failed",
      error: error.message,
    });
  }
};
let handleGenres = async (req, res) => {
  try {
    let genres = await bookService.getGenres(); // Lấy toàn bộ kết quả từ bookService.getGenres()
    return res.status(200).json({
      message: "Success",
      data: genres, // Trả về đối tượng genres chứa mainCategories và subCategories
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get genres failed",
      error: error.message,
    });
  }
};

// xu ly form multipart
let handleUpdate = async (req, res) => {
  try {
    let id = req.params.bookId;
    let updates = req.body;
    let newFiles = req.files;
    let deletedImages = updates.deletedImages
      ? JSON.parse(updates.deletedImages)
      : [];
    let mainImageId = parseInt(updates.main_image_id);
    let discountIds = updates.discount_id;

    if (!id) {
      return res.status(500).json({
        message: "Missing input parameter",
      });
    }

    if (discountIds) {
      await bookService.setDiscounts(id, discountIds);
    }
    //them anh
    newFiles.forEach((file, index) => {
      imageService.createImage({
        url: file.filename,
        book_id: id,
        is_main: 0,
      });
    });
    //cap nhat anh main
    if (mainImageId) {
      await imageService.changeMainImage(id, mainImageId);
    }
    //xoa anh

    if (deletedImages) {
      deletedImages.forEach(async (img) => {
        //cap nhat lai anh main neu bi xoa
        if (img.is_main === 1) {
          let altImage = await imageService.getOneAltImage(id);
          if (altImage) {
            altImage.is_main = 1;
            await altImage.save();
          }
        }
        imageService.deleteImage(parseInt(img.bookImage_id));
      });
    }
    let { book } = await bookService.updateBook(id, updates); //loi id chua parseInt
    return res.status(200).json({
      message: "Success",
      book: book,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update book failed",
      error: error.message,
    });
  }
};

const handleGetAllReferences = async (req, res) => {
  try {
    let {
      genres,
      languages,
      publishers,
      authors,
      bookstatus,
      coverformats,
      discounts,
    } = await bookService.getAllReferences();
    return res.status(200).json({
      message: "Success",
      genres: genres || [],
      languages: languages || [],
      publishers: publishers || [],
      authors: authors || [],
      bookstatus: bookstatus || [],
      coverformats: coverformats || [],
      discounts: discounts || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get all references failed",
      error: error.message,
    });
  }
};

let handleCreate = async (req, res) => {
  try {
    let newBook = parseBody(req.body);
    let newImages = req.files;
    let { book } = await bookService.createBook(newBook);
    //them anh
    newImages.forEach((image, index) => {
      imageService.createImage({
        url: image.filename,
        book_id: book.book_id,
        is_main: index === 0 ? 1 : 0,
      });
    });
    return res.status(200).json({
      message: "Success",
      book: book,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Create book failed",
      error: error.message,
    });
  }
};

module.exports = {
  handleGetById: handleGetById,
  handleGetPage: handleGetPage,
  handleUpdate: handleUpdate,
  handleGetAllReferences: handleGetAllReferences,
  handleCreate: handleCreate,
  handleGenres: handleGenres,
};

function parseBody(body) {
  //parseInt all id
  let newBook = {
    title: body.title,
    num_page: parseInt(body.num_page),
    size: body.size,
    weight: body.weight,
    publication_year: parseInt(body.publication_year),
    price_receipt: parseInt(body.price_receipt),
    decription: body.decription,
    profit_rate: parseFloat(body.profit_rate),
    stock_quantity: parseInt(body.stock_quantity),
    status_id: parseInt(body.status_id),
    language_id: parseInt(body.language_id),
    publisher_id: parseInt(body.publisher_id),
    genre_id: parseInt(body.genre_id),
    discountIds: body.discount_id || [],
    cover_format_id: parseInt(body.cover_format_id),
  };
  return newBook;
}
