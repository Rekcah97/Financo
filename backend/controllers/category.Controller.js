import { use } from "react";
import prisma from "../config/db.config.js";

const IS_VALID_TYPE = ["saving", "expense", "income"];

//ERROR CHECKER 1
const nameConflictChecker = async (name, userId, id) => {
  return await prisma.category.findFirst({
    where: {
      userId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      ...(id && {
        id: { not: id },
      }),
    },
  });
};

//ERROR CHECKER 2
const typeValidityChecker = async (type) => {
  const isValid = IS_VALID_TYPE.includes(type);

  return isValid;
};

//ERROR CHECKER 3
const colorConflictChecker = async (color, userId, id) => {
  return await prisma.category.findFirst({
    where: {
      color,
      userId,
      ...(id && {
        id: { not: id },
      }),
    },
  });
};

export const createCategory = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { name, type, color } = req.body;

    const normaliseName = name.trim();
    const normaliseType = type.toLowerCase().trim();

    const nameConflict = await nameConflictChecker(normaliseName, userId);
    if (nameConflict) {
      return res
        .status(400)
        .json({ success: false, msg: "category with this name already exist" });
    }

    const validType = await typeValidityChecker(normaliseType);
    if (!validType) {
      return res.status(400).json({
        success: false,
        msg: "type can only be expense,saving or income",
      });
    }

    const colorConflict = await colorConflictChecker(color, userId);
    if (colorConflict) {
      return res.status(400).json({
        success: false,
        msg: "category with this color already exist",
      });
    }

    await prisma.category.create({
      data: {
        name: normaliseName,
        type: normaliseType,
        color,
        userId,
      },
    });

    return res
      .status(201)
      .json({ success: true, msg: "category created succesfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

//Route 2
export const deleteCategory = async (req, res) => {
  try {
    const catId = Number(req.params.catId);
    const userId = Number(req.user.id);

    const category = await prisma.category.findFirst({
      where: {
        id: catId,
        userId,
      },
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        msg: "category doesnot exist or already deleted",
      });
    }

    await prisma.category.delete({
      where: {
        id: catId,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "category deleted succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

//Route 3
export const editCategory = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const catId = Number(req.params.catId);
    const { name, type, color } = req.body;

    const category = await prisma.category.findFirst({
      where: {
        userId,
        id: catId,
      },
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "catergory doesnot exist" });
    }

    const data = {};
    if (name !== undefined) {
      const normaliseName = name.trim();
      const nameConflict = await nameConflictChecker(name, userId, catId);
      if (nameConflict) {
        return res.status(400).json({
          success: false,
          msg: "name is occupied by another cateegory",
        });
      }
      data.name = normaliseName;
    }

    if (type !== undefined) {
      const normaliseType = type.toLowerCase().trim();
      const validType = await typeValidityChecker(type);
      if (!validType) {
        return res.status(400).json({
          success: false,
          msg: "type can only be expense,saving or income",
        });
      }

      data.type = normaliseType;
    }

    if (color !== undefined) {
      const colorConflict = await colorConflictChecker(color, userId, catId);
      if (colorConflict) {
        return res.status(400).json({
          success: false,
          msg: "name is occupied by another cateegory",
        });
      }

      data.color = color;
    }

    await prisma.category.update({
      where: {
        id: catId,
      },
      data,
    });

    return res
      .status(200)
      .json({ success: true, msg: "Category edited successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
