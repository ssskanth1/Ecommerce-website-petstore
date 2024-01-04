const {default:mongoose}=require("mongoose")

const dbConnect= async()=>{
    try {
         await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log("Database error");
    
    }
}

module.exports=dbConnect;