import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import ContactsDM from "../models/ContactsDMModel.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email та пароль обов'язкові");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Користувач з такою поштою вже зареєстрован");
    }

    const user = await User.create({ email, password });
    await ContactsDM.create({ user: user._id });

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email та пароль обов'язкові");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Користувач з такою поштою не зареєстрован");
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(400).send("Невірний пароль");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send("Користувача з таким Id не знайдено");
    }

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Ви успішно вийшли з акаунту");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
