import jwt from 'jsonwebtoken'
export const generateToken=(PAYLOAD)=>{
let token=jwt.sign({email:options.email},process.env.JWT_KEY)
return token
}