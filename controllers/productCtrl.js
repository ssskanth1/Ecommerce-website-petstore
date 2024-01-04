const asyncHandler=require('express-async-handler');
const Product=require('../model/productModel');
const slugify = require('slugify');
const Category=require('../model/categoryModel');
const User=require('../model/userModel');

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const path= require('path')


//get all products

const allProducts=asyncHandler(async(req,res)=>{
    
    try {
        const limit=8; // Number of products per page
        const page=req.query.page ? parseInt(req.query.page) : 1;  // Current page number
        const product = await Product.find()
            .skip((page - 1) * limit)  // Skip the results from previous pages
            .limit(limit);  // Limit the number of results to "limit"

        const totalProduct = await Product.countDocuments();
        const totalPages = Math.ceil(totalProduct / limit);

        res.render('product',{product,page,totalPages,limit});
    } catch (error) {

        console.log("all products view error",error);
        
    }
});


//add Product page rendering

const addProduct = asyncHandler(async (req, res) => {
    try {

        const categories = await Category.find(); // Using MongoDB as an example
        res.render('addProduct', { categories: categories });

    } catch (error) {
        console.log('Error in addProduct function', error);
    }
})


// create a new product and save to database

// const createProduct = asyncHandler(async (req, res) => {
//     try {
//         const { title } = req.body;
//         const productData = req.body;

//         const productExist = await Product.findOne({ title:title });
// console.log("thids is body",productData);
//         if (!productExist) {
           
           

           
            
               
               
            

            
//             const images = [];
//             if (req.files && req.files.length > 0) {
//                 for (let i = 0; i < req.files.length; i++) {
//                     images.push(req.files[i].filename);
//                 }
//             }
// console.log('?????????????????????????????????????????');
//             const newProduct = new Product({
//                 title,
//                 description: productData.description,
//                 brand: productData.brand,
//                 price: productData.price,
//                 flavour: productData.flavour,
//                 quantity: productData.quantity,
//                 category: productData.category,
//                 images: images,
//             });
//             console.log('this is new profuct beffor sAVE',newProduct);

//             const pr = await newProduct.save();
// console.log('this  is ',pr);
//             if (pr) {
//                 res.redirect('/admin/product');
//             } else {
//                 console.log('This is not saved');
//             }
//         } else {
//             console.log('Product already exists');
//             res.redirect('/admin/addProduct');
//         }
//     } catch (error) {
//         console.log('Error happened in createProduct function', error);
//         // Handle the error and possibly send an error response to the client.
//     }
// });

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        const productData = req.body;

        const productExist = await Product.findOne({ title });

        
        if (!productExist) {
            const caseInsensitiveCategoryExist = await Product.findOne({
                title: { $regex: new RegExp('^' + title + '$', 'i') }
            });
            if(caseInsensitiveCategoryExist){
                res.redirect('/admin/addProduct');

            }else{
                if (productData.title) {
                    productData.slug = slugify(productData.title);
                }

            




            const images = [];
            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    images.push(req.files[i].filename);
                }
            }

            const newProduct = new Product({
                title: productData.title,
                description: productData.description,
                brand: productData.brand,
                slug: productData.title,  // Corrected this line
                price: productData.price,
                color: productData.color,
                quantity: productData.quantity,
                category: productData.category,
                size:productData.size,  // Corrected the typo here
                images: images,
                flavour:productData.flavour
            });

            const pr = await newProduct.save();

            res.redirect('/admin/product');
        }
    } else {
            console.log('Product already exists');
            res.redirect('/admin/addProduct');
        }
    } catch (error) {
        console.log('Error happened in createProduct function', error);
          // Added error response
    }
});



//rendering specific product edit page

const editProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.query;

        const product = await Product.findById(id);
        const categories = await Category.find();

        if (product) {
            res.render('editProduct', { product: product, categories: categories });
        } else {
            res.status(404).send('Product not found'); 
        }

    } catch (error) {
        console.log('Error occurred in editProduct function', error);
        res.status(500).send('Server Error'); // Send a suitable error response
    }
});

//edit product

const productEdited = asyncHandler(async (req, res) => {
    try {
        const id = req.body.id;
        const productData = req.body;
        
        let updateData = {
            title: productData.title,
            description: productData.description,
            brand: productData.brand,
            slug: slugify(productData.title),  // Assuming you're using slugify
            price: productData.price,
            color: productData.color,
            quantity: productData.quantity,
            size:productData.size,
            category: productData.category
        };

        // Handle image upload
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.filename);
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        res.redirect('/admin/product');
    } catch (error) {
        console.log('Error occurred in productEdited function', error);
        res.status(500).send('Server Error');
    }
});



//aproduct view

const aProductPage = asyncHandler(async (req, res) => {
    try {
       const userId=req.session.user;
       const user=await User.findById(userId);
       console.log(user);
       const productId=req.query.id;
       const product=await Product.findById(productId);

       if(product)
       {
        res.render('aProduct',{user,product})
       }


    } catch (error) {
        console.log('Error occurred in product controller aProductPage function', error);
        res.status(500).send('Server Error'); 
    }
});


//shop a product page

const shopProduct = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; 

    // Calculate the skip value to determine 
    const skip = (page - 1) * limit;

    const product = await Product.find()
        .skip(skip)
        .limit(limit);

    // Get the total number of products in the database
    const totalProductsCount = await Product.countDocuments();

    // Calculate the total number of pages based on the total products and limit
    const totalPages = Math.ceil(totalProductsCount / limit);

    res.render('shop', { product, page, totalPages ,limit });
    } catch (error) {
        console.log('Error occured in shopProduct function', error);
    }
});




//unlist a product

const unlistProduct = asyncHandler(async (req, res) => {
    try {
        const productId = req.query.id;

    const productExists = await Product.findById(productId);
    if (!productExists) {
        return res.status(404).json({ message: "Product not found" });
    }

    const unlistedProduct = await Product.findByIdAndUpdate(productId, {
        status: false
    }, { new: true });

    if (!unlistedProduct) {
        return res.status(400).json({ message: "Failed to unlist product" });
    }

    res.redirect('/admin/product');
    } catch (error) {
        console.log("error occured in unlistProduct function");
    }
});



//list product



const listProduct = asyncHandler(async (req, res) => {
    try {
        const productId = req.query.id;

    const productExists = await Product.findById(productId);
    if (!productExists) {
        return res.status(404).json({ message: "Product not found" });
    }

    const listedProduct = await Product.findByIdAndUpdate(productId, {
        status: true
    }, { new: true });

    if (!listedProduct) {
        return res.status(400).json({ message: "Failed to list product" });
    }

    res.redirect('/admin/product');
    } catch (error) {
        console.log("error occured in listProduct function");
    }
});


//product delete

const deleteProduct=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
        const product=await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true});
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.redirect('/admin/product');
    } catch (error) {
      console.log("deleteProduct error");  
    }
})



//product search in header-----------------------------------------------------------------


const productsSearch=asyncHandler(async(req,res)=>{
    try {

       console.log(req.body);
       const product=await Product.find({
        title:{$regex:`${req.body.search}`,$options:'i'}
    })
       const limit=8; // Number of products per page
       const page=req.query.page ? parseInt(req.query.page) : 1;  // Current page number
       const products = await Product.find()
           .skip((page - 1) * limit)  // Skip the results from previous pages
           .limit(limit);  // Limit the number of results to "limit"

       const totalProduct = await Product.countDocuments();
       const totalpages = Math.ceil(totalProduct / limit);

       res.render('product',{product,page,totalpages,limit,products});
        
    } catch (error) {
        console.log('Error happent in filter controller in ProductSearch funttion',error);
    }
})

//delete single image-----------------------------------------------------------

// const deleteSingleImage = asyncHandler(async (req, res) => {
//     try {
//       console.log("------------------------------------------------------",req.query);
//       const id = req.query.id;
//       const imageToDelete = req.query.img;
  
//       // Update the product in the database to remove the image reference
//       const product = await Product.findByIdAndUpdate(id, {
//         $pull: { images: imageToDelete }
//       });
  
//       // Delete the image file from the filesystem
//       const imagePath = path.join('public', 'admin', 'assets', 'imgs', 'category', imageToDelete);
//       await unlinkAsync(imagePath);
  
//       console.log('Deleted image:', imageToDelete);
  
//       res.redirect(`/admin/editProduct?id=${product._id}`);
//     } catch (error) {
//       console.log('Error occurred in categoryController deleteSingleImage function', error);
     
//     }
//   });

  //new
  const deleteSigleImage = async (req, res) => {
    const id = req.query.id;
    console.log(id,'this  is id -------');
    const imageToDelete = req.query.img;
  
    try {
        const product = await Product.findOneAndUpdate(
            { _id: id },
            { $pull: { image: imageToDelete } },
            { new: true }
        );
  
        if (!product) {
            console.log('Document not found');
            return res.status(404).json({ message: 'Document not found' });
        }
  
        console.log('Element removed successfully');
        res.redirect(`/admin/editProduct?id=${product._id}`)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the element' });
    }
  };
  //
  const deleteSingleImage = asyncHandler(async (req, res) => {
    try {
      console.log(req.query);
      const id = req.query.id;
      const imageToDelete = req.query.img;
    
  
      // Update the product in the database to remove the image reference
      const product = await Product.findByIdAndUpdate(id, {
        $pull: { images: imageToDelete }
      });
  
      // Delete the image file from the filesystem
      const imagePath = path.join('public', 'admin', 'assets', 'imgs', 'category', imageToDelete);
      await unlinkAsync(imagePath);
  
      console.log('Deleted image:', imageToDelete);
  
      res.redirect(`/admin/editProduct?id=${product._id}`);
    } catch (error) {
      console.log('Error occurred in categoryController deleteSingleImage function', error);
     
    }
  });

  




module.exports={
    allProducts,
    addProduct,
    createProduct,
    editProduct,
    productEdited,
    aProductPage,
    shopProduct,
    unlistProduct,
    listProduct,
    deleteProduct,
    productsSearch,
    deleteSingleImage
    
}                                      