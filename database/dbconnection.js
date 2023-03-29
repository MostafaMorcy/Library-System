import mongoose from "mongoose";
export const dbConnection = ()=>{
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_Connection)
  .then(() => {
    
    console.log("dataBase connecting");  })
  .catch((err) => {
    console.log("error connecting");
  });
}
