export const validation=(Schema)=>{
    return (req,res,next)=>{
        let { error } = Schema.validate(req.body, { abortEarly: false }); // scan the data that sent on body
        console.log(error);
        if (!error) {
            next()
        } else {
            res.json(error.details);
          }
    }
}