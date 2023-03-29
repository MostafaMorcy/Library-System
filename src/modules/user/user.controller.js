import { userModel } from "../../../database/models/user/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendConfirmation, sendEmail } from "../../emails/user.email.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { nanoid } from "nanoid";
const signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password, age } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return next(new AppError("email is already exist ", 400));
  const hash = bcrypt.hash(
    password,
    Number(process.env.ROUND),
    async function (err, hash) {
      await userModel.insertMany({ name, email, password: hash, age });
      sendEmail({ email });
      res.json({ message: "user Added" });
    }
  );
});
const verify = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, "mostafa22", async (err, decoded) => {
    if (err) {
      return next(new AppError(err, 401));
    } else {
      await userModel.findOneAndUpdate(
        { email: decoded.email },
        { confirmEmail: true },
        { new: true }
      );
      res.json({ message: "success" });
      next();
    }
  });
});
const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("user is not found ", 400));
  }
  let code = nanoid(5);
  const token = jwt.sign({ email: user.email, id: user._id }, "mostafa22");
  const link = `${req.protocol}://${req.headers.host}/users/resetPassword/${token}`;
  sendConfirmation(
    user.email,
    "Verify your password",
    `<a href='${link}'>Verify password</a>`
  );
  const sendCode = await userModel.findOneAndUpdate(
    { email },
    { code },
    { new: true }
  );
  sendCode
    ? res.status(201).json({ message: "success", code, link })
    : res.status(400).json({ message: "error" });
});
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { code, newPassword } = req.body;
  if (!token) {
    return next(new AppError("invalid token", 400));
  }
  const decoded = jwt.verify(token, "mostafa22");
  if (!decoded?.id) {
    return next(new AppError("invalid token  payload", 400));
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("user not found", 400));
  }
  const match = bcrypt.compareSync(newPassword, user.password);
  if (match) {
    res.status(400).json({ message: "password match , change your password" });
  } else {
    if (code == "") {
      return next(new AppError("invalid code ", 400));
    }
    const hash = bcrypt.hashSync(newPassword, Number(process.env.ROUND));
    const updated = await userModel.updateOne(
      { code },
      { password: hash, code: "" },
      { new: true }
    );
    updated.modifiedCount
      ? res.status(200).json({ message: "success" })
      : res.status(400).json({ message: "error" });
  }
});
const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("incorrect email or password", 400));
  }
  user.password = undefined;
  let token = jwt.sign({ user }, process.env.JWT_KEY);
  const Account = await userModel.updateOne(
    { email },
    { isOnline: true, isLoggedIn: true }
  );
  // login
  Account
    ? res.status(200).json({ message: "success", token })
    : res.status(400).json({ message: "error" });
});
const logOut = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new AppError("user is not found ", 400));
  }
  const userLogOut = await userModel.findOneAndUpdate(
    { email, isLoggedIn: true, isOnline: true },
    {
      isLoggedIn: false,
      isOnline: false,
      lastSeen: Date.now(),
    }
  );
  userLogOut
    ? res.status(200).json({ message: "success" })
    : res.status(400).json({ message: "error" });
});
const softDeleted = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new AppError("user is not found ", 400));
  }
  const deleted = await userModel.findOneAndUpdate(
    { email, isLoggedIn: true,isDeleted:false},
    {
      isDeleted:true
    }
  );
  deleted
    ? res.status(200).json({ message: "is deleted" })
    : res.status(400).json({ message: "error" });
});
export {
  signUp,
  signIn,
  verify,
  forgetPassword,
  resetPassword,
  logOut,
  softDeleted,
};
