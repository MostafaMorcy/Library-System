import { bookModel } from "../../../database/models/user/book/book.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import moment from "moment/moment.js";
const addBook = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  const bookExist = await bookModel.findOne({ title });
  if (bookExist) {
    return next(new AppError("book is already exist ", 400));
  }
  const book = new bookModel({ title });
  const savedBook = await book.save();
  savedBook
    ? res.status(200).json({ message: "success", savedBook })
    : next(new AppError("book is already exist ", 400));
});
const issuedBook = catchAsyncError(async (req, res, next) => {
  const { bookId, issuedUser } = req.body;
  const dateIssued = moment().format("MM/DD/YYYY");
  const returnDate = moment(req.body.returnDate).format("MM/DD/YYYY");
  const book = await bookModel.findOneAndUpdate(
    { issued: false, _id: bookId },
    {
      issued: true,
      dateIssued,
      dateReturned: returnDate,
      issuedUser,
    },
    { new: true }
  );
  book
    ? res.status(200).json({ message: "success", book })
    : next(new AppError("book is already exist ", 400));
});
const searchBook = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  const exist = await bookModel.findOne({ title });
  if (!exist) {
    return next(new AppError("book not found ", 400));
  }
  res.status(200).json({ message: "success", book: exist });
});

const getAllBooks = catchAsyncError(async (req, res, next) => {
  const exist = await bookModel.find({});
  if (!exist.length) {
    return next(new AppError("book not found ", 400));
  }
  res.status(200).json({ message: "success", book: exist });
});
const getAllBooksIssued = catchAsyncError(async (req, res, next) => {
  const exist = await bookModel.find({ issued: true });
  if (!exist.length) {
    return next(new AppError("book not found ", 400));
  }
  res.status(200).json({ message: "success", book: exist });
});
const getBooksUnBorrowed = catchAsyncError(async (req, res, next) => {
  const exist = await bookModel.find({ issued: false, issuedUser: null });
  if (!exist.length) {
    return next(new AppError("book not found ", 400));
  }
  res.status(200).json({ message: "success", book: exist });
});
const issuedBookUser = catchAsyncError(async (req, res, next) => {
  const { issuedUser } = req.body;
  const exist = await bookModel.find({ issued: true, issuedUser });
  if (!exist.length) {
    return next(new AppError("book not found ", 400));
  }
  res.status(200).json({ message: "success", book: exist });
});
const notReturnedBooks = catchAsyncError(async (req, res, next) => {
  const books = await bookModel.find({ issued: true });
  const recentDate = moment();
  let fineDelay;
  for (const i in books) {
    books[i].fine = 30;
    fineDelay = recentDate.diff(books[i].dateReturned, "days") * books[i].fine;
    if (fineDelay < 0) {
      fineDelay = 0;
    }
    books[i].fine = fineDelay;
  }
  res.status(200).json({ message: "success", books });
});
const returnedBooks = catchAsyncError(async (req, res, next) => {
  const { bookId, issuedUser } = req.body;
  const book = await bookModel.findOne({
    issued: true,
    _id: bookId,
    issuedUser,
  });
  const recentDate = moment();
  book.fine = 30;
  let delayDay = recentDate.diff(book.dateReturned, "days");
  book.delayDay = delayDay;
  book.fine = delayDay * book.fine;
  const returned = await bookModel.findOneAndUpdate(
    { issued: true, _id: bookId, issuedUser },
    {
      issued: false,
      dateReturned: null,
      issuedUser: null,
    },
    { new: true }
  );
  if(!returned){return next(new AppError("no returned book ", 400))}
  res.status(200).json({ message: "success", book });
});
export {
  addBook,
  issuedBook,
  searchBook,
  getAllBooks,
  getAllBooksIssued,
  getBooksUnBorrowed,
  issuedBookUser,
  notReturnedBooks,
  returnedBooks
};
