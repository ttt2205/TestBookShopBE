import { Op } from "sequelize";
import { accounts as Account, roles as Role } from "../models";
import { hashUserPassword } from "../services/authService";

const handleGetPage = async (req, res) => {
  try {
    const {
      currentPage = 1,
      itemsPerPage = 3,
      searchText = "",
      status = "all",
      role_id = "all",
      sortBy = "username",
      sortType = "asc",
    } = req.query;

    const offset = (currentPage - 1) * itemsPerPage;
    const limit = parseInt(itemsPerPage);

    // Tạo điều kiện lọc
    const andConditions = [];
    const orConditions = [];

    // Tìm kiếm theo searchText
    if (searchText) {
      orConditions.push({
        username: {
          [Op.like]: `%${searchText}%`,
        },
      });
      orConditions.push({
        account_id: {
          [Op.like]: `%${searchText}%`,
        },
      });
    }

    if (orConditions.length > 0) {
      andConditions.push({
        [Op.or]: orConditions,
      });
    }

    // Lọc theo status
    if (status !== "all") {
      andConditions.push({
        status: parseInt(status),
      });
    }

    // Lọc theo role
    if (role_id !== "all") {
      andConditions.push({
        role_id: parseInt(role_id),
      });
    }

    // Thực hiện truy vấn với phân trang và sắp xếp
    const { rows: accounts, count: totalItems } = await Account.findAndCountAll(
      {
        include: {
          model: Role,
          as: "role",
        },
        attributes: { exclude: ["password"] },
        where: {
          [Op.and]: andConditions,
        },
        offset,
        limit,
        order: [[sortBy, sortType.toUpperCase()]],
      }
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Trả về kết quả
    res.json({
      accounts: accounts,
      pagination: {
        currentPage: parseInt(currentPage),
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleUpdate = async (req, res) => {
  try {
    let pk = parseInt(req.params.id);
    let account = await Account.findByPk(pk);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    account.username = req.body.username;
    account.email = req.body.email;
    account.phone_number = req.body.phone_number;
    account.status = parseInt(req.body.status);
    account.role_id = parseInt(req.body.role_id);

    if (req.body.password) {
      account.password = await hashUserPassword(req.body.password);
    }

    await account.save();

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReferences = async (req, res) => {
  try {
    let roles = await Role.findAll();
    let references = {
      roles: roles,
    };

    res.json(references);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleUpdate: handleUpdate,
  getAllReferences: getAllReferences,
  handleGetPage: handleGetPage,
};
