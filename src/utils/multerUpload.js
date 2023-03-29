import multer,{diskStorage} from "multer";
const configureFilter=()=>{
    return (req,file,cb)=>{
        if(
            (file.fieldname==="pdf"&& file.mimetype=="application/pdf")||
            (file.fieldname==="thumbnail"&& file.mimetype=="image/png") ||
            (file.fieldname==="profile picture"&& file.mimetype=="image/png")
        ){
            return cb(null,true);
        }
        return cb(new Error('invalid format'),false);

    }
}
const storageFilter=()=>{
    return diskStorage({}) // temp 
}
export const multerUpload=()=>{
const fileFilter=configureFilter()
const storage= storageFilter()
return multer({fileFilter,storage})
}