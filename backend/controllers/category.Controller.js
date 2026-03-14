import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.utils.js";

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
const typeValidityChecker = (type) => {
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

export const createCategory = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { name, type, color } = req.body;

    const normaliseName = name.trim();
    const normaliseType = type.toLowerCase().trim();

    const nameConflict = await nameConflictChecker(normaliseName, userId);
    if (nameConflict) {
      return next(new AppError("category with this name already exist", 409));
    }

    const validType = typeValidityChecker(normaliseType);
    if (!validType) {
      return next(
        new AppError("type can only be expense,saving or income", 400),
      );
    }

    const colorConflict = await colorConflictChecker(color, userId);
    if (colorConflict) {
      return next(new AppError("category with this color already exist", 409));
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
    next(err);
  }
};

//Route 2
export const deleteCategory = async (req, res, next) => {
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
      return next(
        new AppError("category doesnot exist or already deleted", 404),
      );
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
    next(err);
  }
};

//Route 3
export const editCategory = async (req, res, next) => {
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
      return next(new AppError("category doesnot exist", 404));
    }

    const data = {};
    if (name !== undefined) {
      const normaliseName = name.trim();
      const nameConflict = await nameConflictChecker(
        normaliseName,
        userId,
        catId,
      );
      if (nameConflict) {
        return next(new AppError("name is occupied by another category", 409));
      }
      data.name = normaliseName;
    }

    if (type !== undefined) {
      const normaliseType = type.toLowerCase().trim();
      const validType = typeValidityChecker(normaliseType);
      if (!validType) {
        return next(
          new AppError("type can only be expense,saving or income", 400),
        );
      }

      data.type = normaliseType;
    }

    if (color !== undefined) {
      const colorConflict = await colorConflictChecker(color, userId, catId);
      if (colorConflict) {
        return next(new AppError("color is occupied by another category", 409));
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
    next(err);
  }
};

//Route 4
export const fetchAllCategory = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};
