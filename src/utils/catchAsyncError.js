export function catchAsyncError(fn) {
  return (req, res, next) => {
    fn(req,res,next).catch((err) => {
      next(err);
    })
  }
}


export const use = fn=>(req,res,next)=>{
Promise.resolve(fn(req,res,next).catch(next))
}
