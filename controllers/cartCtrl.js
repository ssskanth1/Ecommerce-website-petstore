const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')
const Product = require('../model/productModel')


//get cart function

const getCart = asyncHandler(async(req,res)=>{
    try{
        console.log('you are here in getcart');
        const userId = req.session.user 
        const user = await User.findById(userId)

        const productIds = user.cart.map(x=>x.ProductId)
        const product = await Product.find({_id:{$in:productIds}})
        console.log('product is ******************',product);


        let totalSubTotal = 0
        let quantity = 0
        for(const item of user.cart){
            totalSubTotal += item.subTotal 
            quantity += item.quantity
        }
        res.render('cart',{product,cart:user.cart, quantity, totalSubTotal,user})

    } catch(error){
        console.log("error in getcart function",error);
    }
})

//add to cart

const addToCart = asyncHandler(async(req,res)=>{
    try{
        const id = req.query.id
        console.log(id,'this is id ???????');
        const user = req.session.user
        const product = await Product.findById(id)
        console.log(product,'PPP');
        const userData = await User.findById(user)

        if(userData){
            const cartItem = userData.cart.find(item=>String(item.ProductId)===id)
            
            if(cartItem){
                const updated = await User.updateOne(
                    {
                        _id:user, 'cart.ProductId': id
                    },
                    {
                        $inc:{
                            'cart.$.quantity':1,
                            'cart.$.subTotal':product.price,
                        },
                    }
                )
            }else{
                userData.cart.push({
                    ProductId:id,
                    quantity:1,
                    total:product.price,
                    subTotal:product.price,
                })
                //const a =await userData.save()
                await userData.save()
            }
        }
        res.json({status:true})
    } catch(error){
        console.log('error in addtocart fn',error);
    }
})

//delete cart item 

const deleteCartItem = asyncHandler(async (req, res) => {
    try {

        console.log('hai??????????????????????')
        const productId = req.query.id;
        const userId = req.session.user;
        const user = await User.findById(userId);

        if (user) {
          
            const itemIndex = user.cart.findIndex(item => String(item.ProductId) === productId);
            //console.log(res);

            if (itemIndex !== -1) {
                // Show a confirmation dialog using SweetAlert
              

              
                    // Get the quantity of the item being deleted
                    const deletedQuantity = user.cart[itemIndex].quantity;

                    // Remove the cart item using the index
                    user.cart.splice(itemIndex, 1);

                    // Save the updated user with the removed item
                    await user.save();

                    return res.json({ status: true, deletedQuantity });
              
            } else {
                return res.json({ status: false, message: 'No cart item found' });
            }
        } else {
            return res.json({ status: false, message: 'No user found' });
        }
    } catch (error) {
        console.log('error in deleteCartItem function', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});



//add and subtract product count in cart---------------------------------------------

const modifyCartQuantity = asyncHandler(async (req, res) => {
    try {
        // ... (your existing code)
        const productId=req.body.productId;
       
        const userId=req.session.user;
        
        const count = req.body.count;
       
    
    
        const user=await User.findById(userId);
        
        const product=await Product.findById(productId);
        
    
        if(user)
        
    
        {
            const cartItem=user.cart.find(item=>item.ProductId==productId);

        if (cartItem) {
            // ... (your existing code)

            let newQuantity;
            if (count === '1') {
                newQuantity = cartItem.quantity + 1;
            } else if (count === '-1') {
                newQuantity = cartItem.quantity - 1;
            } else {
                return res.json({ status: false, error: 'Invalid count' });
            }

            // Ensure the new quantity is within valid range
            if (newQuantity > 0 && newQuantity <= product.quantity) {
                // Update the quantity and subtotal of the cart item
                const updated = await User.updateOne(
                    { _id: userId, 'cart.ProductId': productId },
                    {
                        $set: {
                            'cart.$.quantity': newQuantity,
                            'cart.$.subTotal': product.price * newQuantity,
                        },
                    }
                );
                // Save the updated user
                await user.save();

                const totalAmount = product.price * newQuantity;

                return res.json({ status: true, quantityInput: newQuantity, total: totalAmount });
            } else {
                return res.json({ status: false, error: 'Out of stock' });
            }
        }

    } }catch (error) {
        console.error('ERROR in cart ctrl modify cart quantity', error);
        return res.status(500).json({ status: false, error: 'Server error' });
    }
});






//delete cart------------------------------------------------------------------------

const deleteCart = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);

        if (user) {
            // Remove all items from the cart
            user.cart = [];
            await user.save();

            res.json({ status: true });
        } else {
            res.json({ status: false, message: 'No user found' });
        }
    } catch (error) {
        console.log('error in cart ctrl function deleteCart', error);
    }
});

module.exports={
    addToCart,
    getCart,
    deleteCartItem,
    modifyCartQuantity,
    deleteCart
}
