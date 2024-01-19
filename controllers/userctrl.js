const User = require("../model/userModel");
const asyncHandler=require("express-async-handler");
const Product = require("../model/productModel");
// const categoryModel = require("../model/categoryModel");
const nodemailer=require("nodemailer");
const Category = require("../model/categoryModel");
const Order=require("../model/orderModel");
const bcrypt = require('bcrypt');
const Banner=require('../model/bannerModel')



const generateHashedPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };


//load index-----------------------------------------------

const loadIndex = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        if (userId) {
            const Dogfood = await Product.find({ category: "Dog Food" });
            const category = await Category.find({ status: false }); // Move the declaration here
            
            console.log(category.length, '>>>>>>>');

            const product = await Product.find({ isDeleted: false, status: true });
            const user = await User.findById(userId);
            const banner = await Banner.find()
            
            res.render("index", { user, product,banner, category, Dogfood });
        }else{                                            
        const Dogfood=await Product.find({category:"Dog Food"});
        const category=await Category.find({status:true});
        console.log(category.length,'>>>>>>>');
        const product = await Product.find({isDeleted:false,status:true});
        const user= await User.findById(userId);
        const banner= await Banner.find();
        req.session.Product = product;

    res.render("index", { user, product,banner,category,Dogfood});

        }
    } catch (error) {
        console.log("Error happens in userController loadIndex function:", error);
        res.redirect('/error');
    }
});





//user login-----------------------------------------------

const loginUser = async(req,res)=>{
    try{
        res.render('login',{message:""});
    } catch(error) {
        console.log("login user error");
        res.redirect('/error');
    }
}

const load=async(req,res)=>{
    try {
        res.redirect('/index')
        
    } catch (error) {
        console.log("login user error",error);
        res.redirect('/error');
    }
}


// const registerUser=async(req,res)=>{
//     try{
//         res.render('registration');
//     } catch(error){
//         console.log(error.message);
//     }
// }
const registerUser=async(req,res)=>{
    try {
        if (req.query.id) {
            req.session.referel = req.query.id;
            console.log(req.session.referel, "session");
          }

        res.render('registration');
    } catch (error) {
        console.log(error.message);
        res.redirect('/error');
    }
}




function generateotp(){

    var digits='1234567890';
    var otp=""
    for(let i=0;i<6;i++){
        otp+=digits[Math.floor(Math.random()*10)];
    }
    return otp;
}

// email-otp verification------------------------------------------------------------

const createUser=asyncHandler(async(req,res)=>{
    try {
     const email=req.body.email;
     console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=",req.body);
     const findUser=await User.findOne({email:email});
     if(!findUser){
         //create a new user
        const otp=generateotp();
        console.log("-----------------------------------------------------",otp);
        const transporter=nodemailer.createTransport({
         service:"gmail",
         port:587,
         secure:false,
         requireTLS:true,
         auth:{
             user:process.env.AUTH_EMAIL,
             pass:process.env.AUTH_PASS
         },
        });
        const info=await transporter.sendMail({
         from:process.env.AUTH_EMAIL,
         to:email,
         subject:"Verify Your Account",
         text:`your OTP is :${otp}`,
         html:`<b> <h4> Your OTP ${otp}</h4>  <br> <a href="/user/emailOTP/">Click here</a></b>`,
         
        });
        
        if(info){
         req.session.userOTP=otp;
         console.log("this is the session otp",req.session.userOTP);
 
         req.session.userData=req.body;
         console.log('iama here at session');
         console.log('this is user data',req.session.userData);
         console.log('this is req.body  data',req.session.userData);
 
 
         res.render("emailOTP",{email:req.body.email})
         console.log("Message sent: %s",info.messageId);
        } 
        else{
         res.json("email error")
        }   
     }
     else{
         //user already exist
         res.render('registration',{errMessage:'User already exist',message:''});
 
     }
    } catch (error) {
     console.log("Create user error",error.message);
     res.redirect('/error');
     
    }
});
 
 
 const resendOtp = asyncHandler(async(req, res) => {
     try {
         const email = req.body.email;
         const findUser = await User.findOne({ email: email });
 
         if (!findUser) {
             const otp = generateotp();
             const transporter = nodemailer.createTransport({
                 service: "gmail",
                 port: 587,
                 secure: false,
                 requireTLS: true,
                 auth: {
                     user: process.env.AUTH_EMAIL,
                     pass: process.env.AUTH_PASS
                 },
             });
 
             const info = await transporter.sendMail({
                 from: process.env.AUTH_EMAIL,
                 to: email,
                 subject: "Resend Verification OTP",
                 text: `Your OTP is :${otp}`,
                 html: `<b><h4>Your OTP is ${otp}</h4><br><a href="/user/emailOTP/">Click here</a></b>`,
             });
 
             if (info) {
                 req.session.userOTP = otp;
                
                 res.json({ success: true, message: "Email " });
             } else {
                 res.json({ success: false, message: "Email error" });
             }
 
            } else {
             res.json({ success: false, message: "Email is already verified." });
         }
     } catch (error) {
         console.log("error in resend otp function", error);
         res.redirect('/error');
     }
});



///

//user login-----------------------------------------------------------------------

  
  //forgot password----------------------------------------------------------------
  
  const forgotPsdPage = asyncHandler(async (req, res) => {
      try {
          res.render("forgotPassword");
      } catch (error) {
          console.log(
              "Error hapents in userControler forgotPsdPage  function :",
              error
          );
          res.redirect('/error');
      }
  });
  
  
  
  //check email is valid in forgot password-------------------------------------------
  
  const forgotEmailValid = asyncHandler(async (req, res) => {
      try {
          const { email } = req.body;
          const findUser = await User.findOne({ email:email });
          console.log(findUser,"thie isi user");
          if (findUser) {
              console.log('>>>>>>>>');
              const otp = generateotp();
              console.log(otp);
              const transporter = nodemailer.createTransport({
                  service: "gmail",
                  port: 587,
                  secure: false,
                  requireTLS: true,
                  auth: {
                      user: process.env.AUTH_EMAIL,
                      pass: process.env.AUTH_PASS,
                  },
              });
              console.log(transporter);
              const info = await transporter.sendMail({
                  from: process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Verify Your Account  ✔",
                  text: `Your OTP is : ${otp}`,
                  html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="/emailOTP/">Click here</a></b>`,
              });
              if (info) {
                  console.log(info,"this is info");
                  req.session.forgotOTP = otp;
                  req.session.forgotEmail = req.body.email;
                  console.log(req.session.forgotEmail);
                 
                 
                 res.redirect('/emailForgot')
                 console.log('??????????????????????????????//');
  
              } else {
                  res.json("email error");
              }
          } else {
             console.log('<<<<<<<<<><><><><><><><><>');
              res.redirect("/forgotPassword");
          }
      } catch (error) {
          console.log(
              "Error happens in userControler forgotEmailValid function:",
              error
          );
          res.redirect('/error');
      }
  });
  
  //--------------------------------------------------------------------
  
  const forgotPsdOTP = asyncHandler(async (req, res) => {
      try {
          const { first, second, third, fourth, fifth, six } = req.body;
          const enteredOTP = first + second + third + fourth + fifth + six;
          console.log("otp entered by user :", enteredOTP);
          if (enteredOTP === req.session.forgotOTP) {
              res.render("resetPassword");
          } else {
              console.log("error in otp ");
          }
      } catch (error) {
          console.log(
              "Error hapents in userControler forgotPsdOTP  function :",
              error
          );
          res.redirect('/error');
      }
  });
  
  //------------------------------
  
  const updatePassword = asyncHandler(async (req, res) => {
      try {
          const email = req.session.forgotEmail;
          const user = await User.findOne({ email });
          if (user) {
              const hashedPassword = await generateHashedPassword(req.body.password);
              const updateUser = await User.findByIdAndUpdate(
                  user._id,
                  {
                      password: hashedPassword,
                  },
                  { new: true }
              );
  
  
              res.redirect("/");
          }
      } catch (error) {
          console.log(
              "Error hapents in userControler updatePassword  function :",
              error
          );
          res.redirect('/error');
      }
  });
  




//user login verification-------------------------------------------------------------


// function generateToken(payload) {
//     return jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: '3d' });
// }
const verifyUser=asyncHandler(async(req,res)=>{
    
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser && (await findUser.isPasswordMatched(password))) {
            req.session.user = findUser._id;
            console.log('this is if');
            res.redirect("/index");
        } else {
            console.log('this is else');

            console.log('error in login userr');
            res.redirect("/login");
        }
    } catch (error) {
        console.log("Error hapents in userControler userLogin function :", error);
        res.redirect('/error');
       
    }
})




//otp checking--------------------------------------------------------------------

const  emailVerified=async(req,res)=>{
try {
    const{first,second,third,fourth,fifth,sixth}=req.body
    console.log('req.body of email ::::');
    const enteredOTP=first+second+third+fourth+fifth+sixth;
console.log('this is the enterd otp',enteredOTP);
console.log('this is the session otp',req.session.userOTP);
    if(enteredOTP===req.session.userOTP){
        const user = req.session.userData;
        console.log(user,"this isn user data");
        const saveUserData = new User({
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            password: user.password,
        });
        //referel
        if(req.session.referel){
            const id=req.session.referel
            console.log(id,'thisis id ');
            const referUser=await User.findById(id)
            saveUserData.wallet=200
            referUser.wallet+=200


            const history= {
                amount:200,
                status:"credit",
                timestamp:Date.now()
            }
            saveUserData.history.push(history)
            referUser.history.push(history)



            const user=await User.findById(req.session.referel)
            user.wallet+=200;
            user.history.push(history)
            await user.save()
        }
        //
       const users= await saveUserData.save();
         req.session.user = users._id
        console.log('this is saved user data>>>>>>>>>>>>>>>>>>>>>>',users);

        res.redirect("/index");

    }
    else{
        console.log('hello thi ios error');
        res.render('emailOTP');
    }
} catch (error) {
    console.log("user email verification error",error);
    res.redirect('/error');
    
}
}
const logout = asyncHandler(async (req, res) => {
try {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/user/index');
    });
} catch (error) {
    console.error("Error during logout:", error);
    //res.status(500).send('Internal Server Error');
    res.redirect('/error');
}
});


//user logout -------------------------------
const userLogout = async (req, res) => {
    try {
        req.session.destroy()
        
        res.redirect("/login");
    } catch (error) {
        console.log("Error happens in userControler userLogout function:", error);
        res.redirect('/error');
       
    }
};

//user Profile creation-----------------------------------------------------------

const userProfile=asyncHandler(async(req,res)=>{
    try {
        const userId=req.session.user;
        const user=await User.findById(userId);
        const order = await Order.find({ userId: userId }).sort({ date: -1 });

        console.log(user);
        res.render('userProfile',{user,order});
        
    } catch (error) {
        console.log("user controller userProfile error",error);
        res.redirect('/error');
    }



})

//edit profile---------------------------------------------------------------------------
const editProfile=asyncHandler(async(req,res)=>{
    try {
        const userId=req.session.user
        const user=await User.findById(userId);
        

        res.render('editProfile',{user});

    } catch (error) {
        console.log("error in user editProfile function");
        res.redirect('/error');
    }
});



//update user profile---------------------------------------------------------------


const updateProfile=asyncHandler(async(req,res)=>{
    try {
        const {id,username,email,mobile}=req.body;
        const user=await User.findById(id);
        const similarUser=await User.find({$and:
            [{_id:{$ne:user._id}},
                {$or:[{username},{email}]}
            ]});

        if(similarUser.length==0)
        {
            user.username=username;
            user.email=email;
            user.mobile=mobile;
            await user.save();
            res.redirect('/profile');
        }    
        else{
            console.log("user already exist");
        }

    } catch (error) {
        console.log("error in upadate user function",error);
        res.redirect('/error');
    }
});


//add user profile picture--------------------------------------------------------------
const addProfilePic = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);

        // Validate the existence of id and file.
        if (!id || !req.file) {
            return res.status(400).send({ message: 'ID or file is missing.' });
        }

        const image = req.file.filename;
        const user = await User.findByIdAndUpdate(
            id,
            {
                image: image,
            },
            { new: true }
        );
        // Optionally, check if the user exists before updating
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        res.redirect('/profile');
    } catch (error) {
        console.error("Error in addProfilePic function:", error);
       // res.status(500).send({ message: 'Internal server error.' });
       res.redirect('/error');
    }
});

//add address---------------------------------------------------------------------------

const addUserAddress=asyncHandler(async(req,res)=>{
    try {
        console.log("req",req.body);
        const {fullName,mobile,region,pinCode,addressLine,areaStreet,landmark,townCity,state,addressType}=req.body;
        const userId=req.session.user;
        const user=await User.findById(userId);
        const newUserAddress={ fullName,mobile,region,pinCode,addressLine,areaStreet,landmark,townCity,state,addressType,main: false};
        if (user.address.length === 0) {
            newUserAddress.main = true;
        }
        user.address.push(newUserAddress);
        await user.save();
        console.log('iam here');
        res.redirect("/profile");

    } catch (error) {
        console.log("error in addUserAddress function",error);
        res.redirect('/error');
    }
});


//edit address---------------------------------------------------------------------

const editAddress=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
        const userId=req.session.user;
        const user=await User.findById(userId);
        const address=user.address.id(id);
        res.render('editAddress',{address});

    } catch (error) {
        res.redirect('/error');
    }
})



//update address------------------------------------------------------------------------

const updateAddress=asyncHandler(async(req,res)=>{
    try {
        const userId=req.session.user;
        const {fullName,mobile,region,pinCode,addressLine,areaStreet,ladmark,townCity,state,addressType,id} = req.body;
        const user=await User.findById(userId);
        if(user)
        {
            const oldAddress=user.address.id(id);
            if(oldAddress){
                oldAddress.fullName=fullName;
                oldAddress.mobile=mobile;
                oldAddress.region=region;
                oldAddress.pinCode=pinCode;
                oldAddress.addressLine=addressLine;
                oldAddress.areaStreet=areaStreet;
                oldAddress.ladmark=ladmark;
                oldAddress.townCity=townCity;
                oldAddress.state=state;
                oldAddress.addressType=addressType;
                await user.save();
                res.redirect('/profile');
                }
                else{
                    console.log("address not found");
                }
         }
        
        
        
    } catch (error) {
        console.log("error in update address function",error);
        res.redirect('/error');
    }
})



//delete address---------------------------------------------------------

const deleteAddress=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
        const userId=req.session.user;
        const user=await User.findById(userId);
        const deleteAddress = await User.findOneAndUpdate(
            { _id: userId },
            {
                $pull: { address: { _id: id } },
            },
            { new: true }
        );;
        console.log("this is the deleted address",deleteAddress);
        res.redirect('/profile');


    } catch (error) {
        console.log("error in deleteAddress function",error);
        res.redirect('/error');
    }
})



///profile
const profile=asyncHandler(async(req,res)=>{
    try {
        const userId=req.session.user;
        const user=await User.findById(userId);
        const order=await Order.find({userId: userId});
        console.log(order);
        res.render('profile',{user,order})
    } catch (error) {
        console.log("error in profile function",error);
        res.redirect('/error');
    }
})



module.exports={
    loginUser,
    registerUser,
    createUser,
    verifyUser,
    emailVerified,
    resendOtp,
    loadIndex,
    userLogout,
    userProfile,
    addProfilePic,
    editProfile,
    updateProfile,
    addUserAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    profile,
    load
}