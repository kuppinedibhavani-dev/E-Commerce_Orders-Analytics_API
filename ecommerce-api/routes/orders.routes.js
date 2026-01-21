import express from "express";
const router=express.Router();
const{readDB,writeDB}=require("../utils/db");
router.post("/",(req,res)=>{
    const {product_id,quantity}=req.body;
    const db=readDB();

    const product=db.products.find(p=>p.id===product_id);
    if(!product)
        return res.status(404).json({message:"Product not found"});
    if(product.stock===0||quantity>product.stock)
        return res.status(400).json({message:"Insufficient stock"});
    const total_amount=product.price * quantity;
    const order={
        id:Date.now(),
        product_id,
        quantity,
        total_amount,
        status:"Placed",
        created_at:new Date().totalSOString().split("T")[0]
    };
    product.stock-=quantity;
    db.orders.push(order);
    writeDB(db);
    res.status(201).json(order);
});
router.get("/",(req,res)=>{
    const db=readDB();
    res.status(200).json({
        count:db.orders.length,
        orders:db.orders
    });
});
router.delete("/:order_id",(req,res)=>{
    const db=readDB();
    const order=db.orders.find(o=>o.id==req.params.order_id);

    if(!order)
        return res.status(404).json({message:"Order not found"});
    if(order.status==="Cancelled")
        return res.status(400).json({message:"Order already cancelled"});
    const today=new Date().totalSOString().split("T")[0];
    if(order.created_at !==today)
        return res.status(400).json({message:"Cancellation not allowed"});
    order.status="Cancelled";
    const product=db.products.find(p=>p.id===order.product_id);
    product.stock+=order.quantity;
    writeDB(db);
    res.status(200).json({message:"Order cancelled successfully"});
});
router.patch("/change/status/:order_id",(req,res)=>{
    const{status}=req.body;
    const validStatusFlow=["Placed","Shipped","Dleivered"];
    const db=readDB();
    const order=db.orders.find(o=>o.id==req.params.order_id);
    if(!order)
        return res.status(404).json({message:"Order not found"});
    if(order.ststus==="Cancelled"||order.status==="Delivered")
        return res.status(400).json({message:"Status change not allowed"});
    const currentIndex=validStatusFlow.indexOf(order.status);
    const nextIndex=validStatusFlow.indexOf(status);

    if(nextIndex!==currentIndex+1)
        return res.status(400).json({message:"Invalid ststus flow"});

    order.status=status;
    writeDB(db);
    res.status(200).json(order);
});
module.exports=router;
