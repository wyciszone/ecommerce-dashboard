import React, { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";
import { navigationLinks } from "../../config/navigationLinks";

export const ProductsPage = () => {
  const [productsData, setProductsData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProductData, setEditProductData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [handleName, setName] = useState("");
  const [handlePrice, setPrice] = useState("");
  const [handleDescription, setDescription] = useState("");
  

  const fetchProductsData = () => {
    fetch("http://127.0.0.1:8000/products")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProductsData(data);
      });
  };

  useEffect(() => {
    fetchProductsData();
  }, []);
  
  const handleEditProduct = (product_id) => {
    const product = productsData.find((product) => product.id === product_id);
    setEditProductData(product);
    setIsEditing(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/products/${editProductData.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editProductData),
    })
      .then((res) => res.json())
      .then((updatedProduct) => {
        console.log("Updated:", updatedProduct);
        setProductsData((prevData) =>
  prevData.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product
  )
);
        setEditProductData({});
        setIsEditing(false);
        window.alert("Successfully updated!!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productData = {
      product_name: handleName,
      price: handlePrice,
      description: handleDescription, 
    };

fetch("http://127.0.0.1:8000/products", {
    method: "POST",
    body: JSON.stringify(productData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setName("");
      setPrice("");
      setDescription("");
      fetchProductsData();
    })
    
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleDeleteProduct = (product_id) => {
    fetch(`http://127.0.0.1:8000/products/${product_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          console.log("Product deleted successfully");
          fetchProductsData();
        } else {
          console.error("Failed to delete product");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <div className="hidden flex-col md:flex">
      <div className="bproduct-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" links={navigationLinks} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <ul>
            {productsData.map((item) => (
              <li key={item.id}>
                <p>
                  <strong>Name: </strong>
                  {item.product_name}
                </p>
                <p>
                  <strong>Price: </strong>
                  {item.price}
                </p>
                <p>
                  <strong>Description: </strong>
                  {item.description}
                </p>
                <button
                  onClick={() => handleDeleteProduct(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditProduct(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
          {isEditing && (
  <form className="editForm" onSubmit={handleUpdateProduct}>
    <input
      type="text"
      value={editProductData.product_name || ""}
      onChange={(e) =>
        setEditProductData({
          ...editProductData,
          product_name: e.target.value,
        })
      }
    />
    <input
      type="text"
      value={editProductData.price || ""}
      onChange={(e) =>
        setEditProductData({
          ...editProductData,
          price: e.target.value,
        })
      }
    />
    <input
      type="text"
      value={editProductData.description || ""}
      onChange={(e) =>
        setEditProductData({
          ...editProductData,
          description: e.target.value,
        })
      }
    />
    <button type="submit">Save changes</button>
  </form>
)}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white text-black p-8 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="product_name">Product Name:</label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={handleName}
                  onChange={(event) => setName(event.target.value)}
                  className="bg-gray-300 px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price:</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={handlePrice}
                  onChange={(event) => setPrice(event.target.value)}
                  className="bg-gray-300 px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  name="description"
                  value={handleDescription}
                  onChange={(event) => setDescription(event.target.value)}
                  className="bg-gray-300 px-2 py-1"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};