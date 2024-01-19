const asyncHandler=require('express-async-handler');
const Category=require('../model/categoryModel');




const addCategory=asyncHandler(async(req,res)=>{
    try {
        const {name,description}=req.body;
         const img = req.file ? req.file.filename : null;
        // if (!description) {
        //     // if there is no description respond with a 400 Bad Request status
        //     return res.status(400).send('Description is required');
        // }
        const categoryExist=await Category.findOne({name});
        if(categoryExist)
        {
           res.redirect('/admin/category');
        }else{
            const caseInsensitiveCategoryExist = await Category.findOne({
                name: { $regex: new RegExp('^' + name + '$', 'i') }
            });
    
            if (caseInsensitiveCategoryExist) {
                
                res.redirect('/admin/category');
            }
       
            const newCategory=new Category(
                {
                    name,
                    description,
                    image:req.file.filename
                }
            );
        
        await newCategory.save();
        res.redirect('/admin/category');
            }
    } catch (error) {
        console.log("add category error",error);
        res.redirect('/error');
        
    }
})

// const addCategory = asyncHandler(async (req, res) => {
//     try {
//         const { name, description } = req.body;
//         const img = req.file ? req.file.filename : null;

//         // Check if a category with the same name (case-insensitive) already exists
//         const caseInsensitiveCategoryExist = await Category.findOne({
//             name: { $regex: new RegExp('^' + name + '$', 'i') }
//         });

//         if (caseInsensitiveCategoryExist) {
//             // Redirect with an error message or handle it as needed
//             return res.redirect('/admin/category');
//         } else {
//             // If no category with the same name (case-insensitively) exists, proceed to add the category
//             const newCategory = new Category({
//                 name,
//                 description,
//                 image: req.file.filename
//             });

//             await newCategory.save();
//             res.redirect('/admin/category');
//         }
//     } catch (error) {
//         console.log("add category error", error);
//         // Handle the error as needed
//     }
// });




//get all category from database

const allCategory=asyncHandler(async(req,res)=>{
      try {
   
        const allCategory=await Category.find();

        req.session.Category=allCategory;
        res.render('category',({category:allCategory}));
      } catch (error) {
        console.log(" this is all catogary error",error);
        res.redirect('/error');
      }
})

//edit category

const editCategory=asyncHandler(async(req,res)=>{
    try {
        const id = req.query.id;

        const category = await Category.findById(id)
       
        if (category) {
            res.render('editCategory', { category:category })
        } else {
            res.redirect('/admin/category')

        }

    } catch (error) {
        console.log('error happens in catogaryController editCatogary function', error);
        res.redirect('/error');
    }
})


// const editCategory = asyncHandler(async (req, res) => {
//     try {
//         const id = req.query.id;

//         const category = await Category.findById(id);

//         if (!category) {
//             return res.redirect('/admin/category');
//         }

//         // Find all other categories except the one being edited
//         const otherCategories = await Category.find({ _id: { $ne: id } });

//         // Get the names of other categories
//         const otherCategoryNames = otherCategories.map((otherCategory) => otherCategory.name);

//         // Render the editCategory view, passing the category data and other category names
//         res.render('editCategory', { category: category, otherCategoryNames: otherCategoryNames });
//     } catch (error) {
//         console.log('Error in categoryController editCategory function', error);
//         // Handle the error as needed
//     }
// });





//update category

// const updateCategory=asyncHandler(async(req,res)=>{
//     try {
//         const id = req.body.id;
//         const img = req.file ? req.file.filename : null;

//         if (img) {
//             await Category.findByIdAndUpdate(id, {
//                 name: req.body.name,
//                 description: req.body.description, // Use the description from the request body
//                 image: req.file.filename
//             }, { new: true })
//        } else {
//             await Category.findByIdAndUpdate(id, {
//                 name: req.body.name,
//                 description: req.body.description,

//             }, { new: true })
//         }
    
//         res.redirect('/admin/category')
//     } catch (error) {
//         console.log("update category error");
//     }

// });
// const updateCategory=asyncHandler(async(req,res)=>{
//     try {
//         console.log('thisis body',req.body);
//         const {name,description}=req.body;
//         const id = req.body.id;
//         const img = req.file ? req.file.filename : null;


//         const categoryExist=await Category.findOne({name});
//         if(categoryExist)
//         {
//            res.redirect('/admin/category');
//         }else{
//             const caseInsensitiveCategoryExist = await Category.findOne({
//                 name: { $regex: new RegExp('^' + name + '$', 'i') }
//             });
    
//             if (caseInsensitiveCategoryExist) {
                
//                 res.redirect('/admin/category');
//             }
    


//             let updateData = {
//                 name: req.body.name,
//                 description: req.body.description  
//             };

            
//         if (img) {
//             updateData.image = img;
//         }



//         console.log('this is data',updateData);

//        const a= await Category.findByIdAndUpdate(id,updateData);  
// console.log('this is the updatedcategory',a);
//         res.redirect('/admin/category');

//         }

        



//     } catch (error) {
//         console.log("update category error");
//     }

// });
const updateCategory=asyncHandler(async(req,res)=>{
    try {
        const id = req.body.id;
        const img = req.file ? req.file.filename : null;

        let updateData = {
            name: req.body.name,
            description: req.body.description  
        };

        if (img) {
            updateData.image = img;
        }

        await Category.findByIdAndUpdate(id, updateData, { new: true });  // Corrected model name

        res.redirect('/admin/category');
    } catch (error) {
        console.log("update category error");
        res.redirect('/error');
    }

});


//delete category

const deleteCategory=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
        const category=await Category.findByIdAndUpdate(id,{
            isDelete : true},{new:true})
       if(category){
        res.redirect('/admin/category');
       }else{
        res.send('error in delete the cart')
       }
    } catch (error) {
        console.log("delete category error",error);
        res.redirect('/error');
    }
})

//unlist a category

const unlistCategory=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
        const unlistedCategory=await Category.findByIdAndUpdate(id,{status:false},{new:true});
        res.redirect('/admin/category');
    } catch (error) {
        console.log("unlist category error");
        res.redirect('/error');
    }
});

//list a category

const listCategory=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id;
    const listedCategory=await Category.findByIdAndUpdate(id,{status:true},{new:true});
    res.redirect('/admin/category');
    } catch (error) {
       console.log("list category error"); 
       res.redirect('/error');
    }

    
});







module.exports={
    addCategory,
    allCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    unlistCategory,
    listCategory,
    
}