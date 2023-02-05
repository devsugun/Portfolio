import React, { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("mongodb+srv://devsegun:Domcat-1013@cluster0.ivbooq0.mongodb.net/?retryWrites=true&w=majority")
      .then(response => response.json())
      .then(data => {
        setData(data.data);
      });
  }, []);

  const addItem = () => {
    const newData = [...data];
    newData.push({
      order_item_id: 0,
      product_id: 0,
      products: { product_category_name: "" },
      price: 0,
      shipping_limit_date: ""
    });
    setData(newData);
  };
  

  const editItem = (index) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      order_item_id: 1,
      product_id: 1,
      products: { product_category_name: "Category 1" },
      price: 10,
      shipping_limit_date: "2022-01-01"
    };
    setData(newData);
  };
  
  const deleteItem = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };
  
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Order Item ID</th>
            <th>Product ID</th>
            <th>Product Category</th>
            <th>Price</th>
            <th>Shipping Limit Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.order_item_id}>
              <td>{item.order_item_id}</td>
              <td>{item.product_id}</td>
              <td>{item.products.product_category_name}</td>
              <td>{item.price}</td>
              <td>{item.shipping_limit_date}</td>
              <td>
                <button onClick={() => editItem(index)}>Edit</button>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default App;
