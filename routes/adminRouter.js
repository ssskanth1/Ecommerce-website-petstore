const express= require("express");
const router=express();
const {loginAdmin, adminDashboard,adminVerifyLogin, userField, blockUser, unblockUser,logout}=require('../controllers/adminctrl');
const { allCategory,addCategory,editCategory, deleteCategory,updateCategory,unlistCategory, listCategory } = require("../controllers/categoryctrl");
const {allProducts,addProduct,createProduct,editProduct,productEdited,unlistProduct,listProduct,deleteProduct,deleteSingleImage}=require("../controllers/productCtrl");
const {adminOrderDetails,changeStatusPending,changeStatusConfirmed,changeStatusShipped,changeStatusCanceled,changeStatusDelivered,changeStatusReturned,changeStatusReturnRejected, adminOrderList,loadsalesReport,salesReport}=require('../controllers/orderCtrl');
const {loadCoupon,addCoupon,coupon,editCoupon,deleteCoupon,updateCoupon}=require('../controllers/couponCtrl')
const{productOfferpage,updateOffer,categoryOffer,updateCategoryOffer}=require('../controllers/offerCtrl')
const {banner,addNewBanner,createBanner,editBanner,updateBanner,deleteBanner}=require('../controllers/bannerCtrl');
 

router.set('view engine','ejs'); 
router.set('views','./views/admin');
const {upload}=require('../multer/multer');


const {
    isAdminAuth
}=require('../middleware/adminAuth')



//admin route------------------------------------------------------------------------

router.get('/login',loginAdmin);
router.post('/login',adminVerifyLogin);
router.get('/dashboard',adminDashboard);
router.get('/users',userField);
router.get('/block',blockUser);
router.get('/unblock',unblockUser);
router.get('/logout',logout);


//product route-------------------------------------------------------------------------

router.get('/product',allProducts);
router.get('/product/:page', allProducts);
router.get('/addProduct',addProduct);
router.post('/createProduct',upload.array('images', 12),createProduct);
router.get('/editProduct',editProduct);
router.post('/productEdited',upload.array('images', 12),productEdited);
router.get('/unlistProduct',unlistProduct);
router.get('/listProduct',listProduct);
router.get('/deleteProduct',deleteProduct);

router.get('/deleteSingleImage',isAdminAuth,deleteSingleImage);



//category route--------------------------------------------------------------------------

router.get('/category',allCategory)
router.post('/addCategory',upload.single('image'),addCategory);
router.get('/editCategory',editCategory);
router.post('/updateCategory',upload.single('image'),updateCategory);
router.get('/deleteCategory',deleteCategory);
router.get('/unlistCategory',unlistCategory);
router.get('/listCategory',listCategory);
router.get('/deleteProduct',deleteProduct);

//order route-------------------------------------------------------------------------------

router.get('/adminOrderList',adminOrderList);
router.get('/adminOrderDetails',adminOrderDetails);
router.get('/changeStatusPending',changeStatusPending);
router.get('/changeStatusConfirmed',changeStatusConfirmed);
router.get('/changeStatusShipped',changeStatusShipped);
router.get('/changeStatusCanceled',changeStatusCanceled);
router.get('/changeStatusdelivered',changeStatusDelivered);
router.get('/changeStatusReturned',changeStatusReturned);
router.get('/changeStatusReturnRejected',changeStatusReturnRejected);  

//coupen route------------------------------------------------------------------------------

router.get('/addCoupon',isAdminAuth,isAdminAuth,loadCoupon);
router.post('/addCoupon',isAdminAuth,addCoupon);
router.get('/coupon',isAdminAuth,coupon);
router.get('/editCoupon',isAdminAuth,editCoupon);
router.post('/updateCoupon',isAdminAuth,updateCoupon);
router.get('/deleteCoupon',isAdminAuth,deleteCoupon);

//banner route--------------------------------------------------------------------------------

router.get('/banner',isAdminAuth,banner);isAdminAuth,
router.get('/addNewBanner',isAdminAuth,addNewBanner);
router.post('/createBanner',isAdminAuth,upload.single('image'),createBanner);
router.get('/editBanner',isAdminAuth,editBanner);
router.post('/updateBanner',isAdminAuth,upload.single('image'),updateBanner);
router.get('/deleteBanner',isAdminAuth,deleteBanner);




//---------offer------- ---------------------------------------------------------------------
router.get('/productOfferpage',isAdminAuth,productOfferpage)
router.post('/updateOffer',isAdminAuth,updateOffer)
router.get('/categoryOffer',isAdminAuth,categoryOffer)
router.post('/updateCategoryOffer',isAdminAuth,updateCategoryOffer)


//sales report------------------------------------------------------------------------------

router.get('/loadsalesReport',isAdminAuth,loadsalesReport);
router.get('/salesReport',isAdminAuth,salesReport);

// search--------------------------------------------------------------------------


module.exports=router;