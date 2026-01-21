import { Router } from "express";
const route=Router();
import { readDB, writeDB } from "../utils/db";
Router.get("/",(req,res)=>{
    const db=readDB();
    res.status(200).json({
        count:db.products.length,
        products:db.products
    });
});
Router.post("/",(req,res)=>{
    const{name,price,stock}=req.body;
    const db=readDB();
    const product={
        id:Date.now(),
        name,
        price,
        stock
    };
    db.products.push(product);
    writeDB(db);
    res.status(201).json(product);
});
module.exports=Router;