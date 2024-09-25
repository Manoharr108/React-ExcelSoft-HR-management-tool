const mongoose = require("mongoose");

const emplyoeeSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        photo:{
            type:String,
            require:true
        },
        role:{
            type:String,
            require:true
        }, 
        category:{
            type:String,
            require:true
        },
        quater:{
            type:String,
            require:true
        },
    }
);

const operation = mongoose.model("emplyoee",emplyoeeSchema);

module.exports = operation;