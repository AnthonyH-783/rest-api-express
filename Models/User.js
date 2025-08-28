const mongoose = require("mongoose");
const { type } = require("os");
const { boolean } = require("webidl-conversions");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        min: 3,
        max: 20,
        unqiue: true,
    },
    email:{
        type:String,
        required:true,
        max:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:20
    },
    profilePicture:{
        type:String,
        default:''
    },
    followers:{
        type:Array,
        default:[]
    },
    followees:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50,
        default:''
    },
    city:{
        type:String,
        max:50,
        default:''
    },
    from:{
        type:String,
        max:50,
        default:''
    },
    relationship:{
        type:Number,
        enum:[1,2,3], // 1: Single, 2: Married, 3: Other
    }

},
{timestamps : true}

);

module.exports = mongoose.model("User", UserSchema);