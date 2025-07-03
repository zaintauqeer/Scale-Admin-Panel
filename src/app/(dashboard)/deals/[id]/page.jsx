"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DealDetailPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    const fetchDeal = async () => {
      const res = await fetch(`https://scale-gold.vercel.app/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      setDeal(data);
    };
    fetchDeal();
  }, [id]);

  if (!deal) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{deal.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img src={deal.image} alt="Deal" className="w-[300px] h-auto object-cover" />
        <div>
          {/* <p><strong>Supplier:</strong> {deal.supplier}</p> */}
          <p><strong>Delivery Area:</strong> {deal.deliveryArea}</p>
          <p><strong>Min Order Quantity:</strong> {deal.minOrderQty}</p>
          <p><strong>Committed Volume:</strong> {deal.volumeCommitted}</p>
          <p><strong>Price Per Unit:</strong> {deal.pricePerUnit} SAR</p>
          <p><strong>Est. Delivery Window:</strong> {deal.deliveryTime}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-1">Notes</h3>
        <p className="text-gray-600">{deal.notes}</p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="border px-4 py-2">Close Deal</button>
        <button className="bg-[#F15625] text-white px-4 py-2 rounded">Edit Deal</button>
      </div>
    </div>
  );
}
