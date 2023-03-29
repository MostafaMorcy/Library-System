import jwt from 'jsonwebtoken'
export const userAuth=(req,res,next)=>{
    const token = req.header("token");
    jwt.verify(token,process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        res.json({ message: "invalied token ", err });
      }else{
console.log(decoded);
req.userId=decoded.user._id
req.decoded={email:user.email,id:user._id,role:user.role}
next()
      }
    })
}