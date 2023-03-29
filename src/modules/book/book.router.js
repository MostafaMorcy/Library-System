import express from "express";
import { userAuth } from "../../middleware/Auth.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import { multerUpload } from "../../utils/multerUpload.js";
import * as bookController from "./book.controller.js";
export const bookRouter = express.Router();
bookRouter.post(
  "/",userAuth,isAdmin,
  multerUpload().fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "pdf",
      maxCount: 1,
    },
  ]),
  bookController.addBook
);
bookRouter.put('/',bookController.issuedBook)
bookRouter.get('/search',bookController.searchBook)
bookRouter.get('/',bookController.getAllBooks)
bookRouter.get('/issued',bookController.getAllBooksIssued)
bookRouter.get('/unBorrowed',bookController.getBooksUnBorrowed)
bookRouter.get('/userBooks',bookController.issuedBookUser)
bookRouter.get('/notReturnedBooks',bookController.notReturnedBooks)
bookRouter.get('/returnedBooks',bookController.returnedBooks)