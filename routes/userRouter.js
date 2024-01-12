const express = require("express");
const router = express.Router();
const {upload}=require('../multer/multer');
const auth = require('../middleware/userAuth');
const{getCart,addToCart,deleteCartItem,deleteCart,modifyCartQuantity}=require("../controllers/cartCtrl");
const {aProductPage,shopProduct}=require('../controllers/productCtrl');
const {
    loginUser,
    registerUser,
    createUser,
    emailVerified,
    verifyUser,
    loadIndex,
    resendOtp,
    userLogout,
    editProfile,
    updateProfile,
    addUserAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    profile,
    load
} = require('../controllers/userctrl');

const { isLogged} = require('../middleware/userAuth')

const {checkOut,orderPlaced,orderDetails,orderPage,allOrderDetails,cancelOrder,returnOrder,useWallet,verifyPayment}=require('../controllers/orderCtrl');

const {productSearch,CategoryFilter,filterSearch,colorFilter,priceFilter,brandFilter,clearFilter,sortByPrice,sizeFilter}=require('../controllers/filterCtrl');
const {addToList,Wishlist,deleteWishlistItem}=require('../controllers/wishlistCtrl');
const {addMoneyWallet,updateMongoWallet,sumWallet,sumWalletBuynow,walletPayment}=require('../controllers/walletCtrl');
const {validateCoupon}=require('../controllers/couponCtrl');
const {invoice,invoices}=require('../controllers/invoiceCtrl');



// user---------------------------------------------------------------------------

router.get('/',load)
router.get('/login',loginUser);
router.get('/register',registerUser);
router.post('/register',createUser);
router.post('/emailVerified',emailVerified);
router.post('/login',verifyUser);
router.get('/index',loadIndex);
router.post('/resendOTP',resendOtp);
router.get('/userLogout',userLogout)



//user profile----------------------------------------------------------------------
// router.get('/profile',isLogged,userProfile);
// router.post('/addProfilePic',isLogged,upload.single('image'), addProfilePic);
router.get('/editProfile',isLogged,editProfile);
router.post('/updateProfile',isLogged,updateProfile);


//user address----------------------------------------------------------------------
router.post('/addUserAddress',isLogged,addUserAddress);
router.get('/editAddress',isLogged,editAddress);
router.post('/updateAddress',isLogged,updateAddress);
router.get('/deleteAddress',isLogged,deleteAddress);


//payment 
router.post('/verifyPayment',verifyPayment)
    

//products--------------------------------------------------------------------------
router.get('/aProduct',isLogged,upload.single('images'),aProductPage)
router.get('/shop', shopProduct)


//cart-------------------------------------------------------------------------------
router.get('/cart',isLogged,getCart);
router.get('/addToCart',isLogged,addToCart);
router.get('/deleteCartItem',isLogged,deleteCartItem);
router.post('/modifyCartQuantity',isLogged,modifyCartQuantity);
router.get('/deleteCart',isLogged,deleteCart);


//order--------------------------------------------------------------------------------
router.get('/checkout',isLogged,checkOut);
router.post('/orderPlaced',isLogged,orderPlaced);
router.get('/orderDetails',isLogged,orderDetails);
router.get('/orderPage',isLogged,orderPage);
router.get('/allOrderDetails',isLogged,allOrderDetails);
router.get('/cancelOrder',isLogged,cancelOrder);
router.post('/return',isLogged,returnOrder);
router.post('/verifyPayment',isLogged,verifyPayment)



//filter---------------------------------------------------------------------------------

router.post('/productSearch',productSearch);
router.get('/CategoryFilter',CategoryFilter);
router.post('/filterSearch',filterSearch);
router.get('/priceFilter',priceFilter);
router.get('/brandFilter',brandFilter);
router.get('/sizeFilter',sizeFilter);
router.get('/clearFilter',clearFilter);//clear all the filter 
router.get('/sortByPrice',sortByPrice);
// router.get('/colorFilter',colorFilter);




//wallet-------------------------------------------------------------------------------------

router.post('/addMoneyWallet',isLogged,addMoneyWallet)
router.post('/updateMongoWallet',isLogged,updateMongoWallet)
router.post('/useWallet',isLogged,useWallet)
router.get('/sumWalletBuynow',isLogged,sumWalletBuynow)
router.post('/walletPayment',isLogged,walletPayment)
router.post('/sumWallet',sumWallet);


//coupon
router.post('/validateCoupon',validateCoupon);


//wishlist-----------------------------------------------------------------------------------


router.get('/Wishlist',isLogged,Wishlist)//rendering the wishlist
router.get('/addToList',isLogged,addToList)// add apriduct to the wish list
router.get('/deleteWishlistItem',isLogged,deleteWishlistItem)
        

//invoice--------------------------------------------------------------------------------------

router.get('/invoice',isLogged,invoice);
router.get('/invoices',isLogged,invoices);



//profile------------------------
router.get('/profile',isLogged,profile)
router.post('/addAddress',addUserAddress)




module.exports=router;