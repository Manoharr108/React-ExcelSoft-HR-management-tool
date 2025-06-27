const mongoose = require('mongoose')

const remarksSchema = mongoose.Schema(
    {
        quarter:{
            type:String,
            require:true
        },
        category:{
            type:String,
            require:true
        },
        text:{
            type:String,
            require:true
        }
    }
)

const roperation = mongoose.model("remark", remarksSchema)

module.exports = roperation;