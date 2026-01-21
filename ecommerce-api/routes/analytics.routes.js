import express from "express";
const router=express.Router();
const {readDB}=require("../utils/db");
router.get("/all-orders",(req,res)=>{
    const{orders}=readDB();
    res.status(200).json({
        count:orders.length,
        orders:orders.map(order=>order)
    });
});
router.get("/cancelled-orders",(req,res)=>{
    const cancelledOrders=readDB().orders.filter(
        order=>order.status==="Cancelled"
    );
    res.status(200).json({
        count:cancelledOrders.length,
        orders:cancelledOrders
    });
});
router.get("/shipped",(req,res)=>{
   const shippedOrders=readDB().orders.filter(
    order=>order.status==="shipped"
   );
   res.status(200).json({
    count:shippedOrders.length,
    orders:shippedOrders
   });
});
router.get("/total-revenue/:producct_id",(req,res)=>{
    const db=readDB();
    const product=db.products.find(
        p=>p.id==req.params.product_id
    );
    if(!product)
        return res.status(404).json({message:"Product not found"});
    const totalRevenue=db.orders.filter(
        order=>order.product_id==product.id&&order.status !=="Cancelled"
    );
    res.status(200).json({
        product_id:product.id,
        total_revenue:totalRevenue
    });
});
router.get("/all-total-revenue",(req,res)=>{
    const db=readDB();
    const totalRevenue=db.orders.filter(order=>order.status!=="Cancelled")
    .reduce((sum,order)=>{
        const product=db.products.find(
            p=>p.id===order.product_id
        );
        return sum+order.quantity *product.price;
    },0);
    res.status(200).json({total_revenue:totalRevenue});
});
module.exports=router;