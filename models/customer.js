
const mongoose = require("mongoose");
const { Schema } = mongoose;
main()
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1/relationDemo");
}

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId, // to store the id
      // of the orderSchema because the its already exists
      ref: "Order", // it tells in which collection we
      // are referening object == which object id we are refering
    },
  ],
});


const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

/* const addCustomer = async () => {
  let customer = new Customer({
    name: "Aman",
  });
  /* 
  here we can add by two methods:
  1. we can add by using object_id
  2. object/ child document 

  in mongo db the objectid stored not the entire data
  
  // execution of one to many
  // let order1 = await Order.findOne({item: "Samosa"});
  // let order2 = await Order.findOne({item: "Chocolate"});
    
  // customer.orders.push(order1); // object
  // customer.orders.push(order2);

  // let result = await customer.save();
  // console.log(result);

  let result = await Customer.find();
  console.log(result);
};
addCustomer();
*/
const findCustomer = async()=>{
    let result = await Customer.find().populate("orders");
    console.log(result);
    console.log(result[0]); 
    /* 
    Connection successful!
[
  {
    _id: new ObjectId('663faaac849dd0e7c741af53'),    
    name: 'Aman',
    orders: [ [Object] ],
    __v: 0
  }
]
{
  _id: new ObjectId('663faaac849dd0e7c741af53'),      
  name: 'Aman',
  orders: [
    {
      _id: new ObjectId('663f5519381a64cc449f9596'),  
      item: 'Samosa',
      price: 12,
      __v: 0
    }
  ],
  __v: 0
}
    */
}
findCustomer();



/*  const addOrders = async()=>{
    let res = await Order.insertMany(
        {item: "Samosa", price: 12},
        {item: "Chips", price: 12},
        {item: "Samosa", price: 12}

    );
    console.log(res);
 }
 addOrders(); 
 */

 /* 
  Populate: one to many  
  1. we can use populate method to get the data from the child document
  2. we can use populate method to get the data from the object id

  it wll replace the object_id with the object/entire document(etire information) in db
 
 */