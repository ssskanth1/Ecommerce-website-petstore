const mongoose = require('mongoose');


// Schema
var orderSchema = new mongoose.Schema({
    totalPrice:{
        required:true,
        type:Number
    },
    size:{  
        type:String 
    },
    createdOn:{
        required:true, 
        type:Date,
        default:Date.now
    },
    date:{
        required:true,
        type:String,

    },
    product:{
        required:true,
        type:Array
    },
    userId:{
        required:true,
        type:String

    },
    payment:{
        required:true,
        type:String,
    },
    status:{
        required:true,
        type:String
    },
    address:{
        type:Array,
        required:true
    },
    returnreason:{
        type:String,
        default:''
    }
    
});





//Export the model
module.exports = mongoose.model('Order', orderSchema);