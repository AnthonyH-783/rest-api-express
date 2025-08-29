const mongoose = require("mongoose");
const { type } = require("os");
const { boolean } = require("webidl-conversions");

const PostSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true,
    },
    desc:{
        type:String,
        max:500,
        default:''
    },
    img:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    }


},
{timestamps : true}

);

module.exports = mongoose.model("Post", PostSchema);