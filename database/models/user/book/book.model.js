// import { boolean, string } from "joi";
import mongoose from "mongoose";
const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    issuedUser: {
      type: mongoose.SchemaTypes.ObjectId,
       ref: 'user',
    },
issued:{type:Boolean,default:false},
dateIssued:{type:String,default:null},
dateReturned:{type:String,default:null},
dayDelay:Number,
fine:{Number,default:0 },
thumbnailURL:String,
pdfURL:String
  },
  {
    timestamps: true,
  }
);
bookSchema.virtual('thumbnailPublicId').get(()=>{
  return `books/${this._id}/${this._id}thumbnail`
})
bookSchema.virtual('pdfPublicId').get(()=>{
  return `books/${this._id}/${this._id}pdf`
})


export const bookModel = mongoose.model("book", bookSchema);
