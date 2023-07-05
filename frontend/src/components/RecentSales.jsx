import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useEffect, useState } from "react";

export function RecentSales() {
  const [ordersData, setOrdersData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const fetchOrdersData = async () => {
    const response = await fetch("http://127.0.0.1:8000/orders");
    const data = await response.json();
    const sortedOrders = data.slice().sort((a, b) => b.id - a.id); // Sort orders by ID in descending order
    setOrdersData(sortedOrders.slice(0, 5)); // Set the state with the first five orders
  };
  

  const fetchCustomersData = async () => {
    const response = await fetch("http://127.0.0.1:8000/customers");
    const data = await response.json();
    setCustomersData(data);
  };

  const fetchProductsData = async () => {
    const response = await fetch("http://127.0.0.1:8000/products");
    const data = await response.json();
    setProductsData(data);
  };

  useEffect(() => {
    fetchOrdersData();
    fetchCustomersData();
    fetchProductsData();
  }, []);
  return (
    <div>
      {ordersData.map((order) => (
  <div className="flex items-center" key={order.id}>
    <Avatar className="h-9 w-9">
      <AvatarImage src="/avatars/01.png" alt="Avatar" />
      <AvatarFallback>{order.name}</AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{order.customer}</p>
      <p className="text-sm text-muted-foreground">{order.email}</p>
    </div>
    <div className="ml-auto font-medium">{order.total}$</div>
  </div>
))}
    </div>
  );
}