const { Mongoose } = require("mongoose");

Mongoose

function saveUser (req, res){
    const newUser = new User(req.body)

    return newUser
        .save()
        .then((result) => {
            res
                .status(201)
                .json({ message: 'user ${result._id} created', content: result})
        })
        .catch((err) => {
            if(err.code === 11000){
                res.status(409).json({ message: 'this adress mail already extisting' })
            } else if (
                err.errors &&
                Object.keys(err.errors).length > 0 &&
                err.name === 'ValidationError'
            ){
                res.status(422).json({ message : error.message })
            } else {
                res.status(500).json(err)
            }
        })
}