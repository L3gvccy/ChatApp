import User from "../models/UserModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send("Прізвище та ім'я обов'язкові");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    if (!req.file) {
      return res.status(400).send("Файл не передано");
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "qchat/profile_images",
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        image: result.secure_url,
        imagePublicId: result.public_id,
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json({
      user: user,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const deleteProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const existingUser = await User.findById(userId);
    const publicId = existingUser.imagePublicId;

    if (!publicId) {
      return res.status(404).send("Файл не містить Id");
    }

    await cloudinary.uploader.destroy(publicId);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        image: null,
        imagePublicId: null,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
