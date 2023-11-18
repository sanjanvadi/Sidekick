import {addProductToUser, getAllProducts, getProductById, myProducts} from "../data/products.js";
import xss from "xss";
import { getUserByUserID, setNewOutfit } from "../data/userData.js";

const purchaseProduct = async( req, res)=>{
    let id = xss(req.user.id); 
    let productId = xss(req.body.productId);
    console.log("Product id", productId);

    if (id == undefined){
        return res.status(400).json({error:"please log in"});
    }
    if (productId == undefined){
        return res.status(400).json({error: "Product ID needed"});

    }
    let userData = undefined;
    // get user data;
    try {
         userData = await getUserByUserID(id)
    } catch (error) {
        console.log(error);
    }
    const userProducts = userData.products;
    console.log(userProducts);
    // if you already own it.
    for (let productOwned of userProducts){
        if (productOwned){
            if (productOwned === productId){
                return res.status(200).json({msg: "You already own it"});
            }
        }
    }
    console.log("you can afford it");
    //Can you afford it
    const reward = userData.rewards;
    let product = undefined;

    try {
        product = await getProductById(productId);
    } catch (error) {
        console.log(error);
    }

    if (reward<product.points){
        return res.status(400).json("Sorry, not enough rewards");
    } 

    //add product to user;
    try {
        await addProductToUser(id, productId, reward-product.points);
    } catch (error) {
        console.log(error);
    }
    return res.json("Purchase Successful");
}

const getPurchasableProducts = async(req, res)=>{

    let userData = undefined;
    let allProducts = undefined;
    let purchasableProdcut = [];

    try {
        userData = await getUserByUserID(req.user.id);
        allProducts = await getAllProducts();
    } catch (error) {
        console.log(error);
    }

    for (const prod of allProducts){
        let present = false;
        for (const userProduct of userData.products){
            if (userProduct == prod._id){
                present = true;
                break;
            }
        }
        if(!present) purchasableProdcut.push(prod);
    }
    
    return res.json({products: purchasableProdcut});
}

const getMyProducts = async(req, res)=>  {         
    let id = xss(req.user.id); 
    let products = undefined;

    try {
        products = await myProducts(id);
    } catch (error) {
        console.log(error);
    }
    res.json({products});
}

const updateOutfit =async(req, res) =>{
    const id = xss(req.user.id);
    const img = xss(req.body.img);

    try {
       await setNewOutfit(id, img);
    } catch (error) {
        return res.status(400).json({error});
    }
   return res.status(200).json("Success");
};

export {purchaseProduct, getPurchasableProducts, getMyProducts, updateOutfit}