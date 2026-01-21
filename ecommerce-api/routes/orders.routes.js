Router.post("/",(req,res)=>{
    const{product_id,quantity}=req.body;
    const db=readDB();

    const product=db.products.find(p=>p.id===product_id);
    if(!product)return res.status(404).json({message:"Product not found"});
    if(product.stock===0||quantity>product.stock)
        return res.status(400).json({message:"Insufficient stock"});
    const total_amount=product.price * quantity;

    const order={
        id:Date.now(),
        product_id,
        quantity,
        total_amount,
        status:"Placed",
        created_at:new Date()
    };
    product.stock-=quantity;
    db.orders.push(order);
    writeDB(db);
    res.status(201).json(order);
});