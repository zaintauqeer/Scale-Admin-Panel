// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function DealDetailPage() {
//   const { id } = useParams();
//   const [deal, setDeal] = useState(null);

//   useEffect(() => {
//     const fetchDeal = async () => {
//       const res = await fetch(`https://scale-gold.vercel.app/api/items/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });
//       const data = await res.json();
//       setDeal(data);
//     };
//     fetchDeal();
//   }, [id]);

//   if (!deal) return <div>Loading...</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-2">{deal.title}</h1>
//       <div className="flex flex-col md:flex-row gap-6">
//         <img src={deal.image} alt="Deal" className="w-[300px] h-auto object-cover" />
//         <div>
//           {/* <p><strong>Supplier:</strong> {deal.supplier}</p> */}
//           <p><strong>Delivery Area:</strong> {deal.deliveryArea}</p>
//           <p><strong>Min Order Quantity:</strong> {deal.minOrderQty}</p>
//           <p><strong>Committed Volume:</strong> {deal.volumeCommitted}</p>
//           <p><strong>Price Per Unit:</strong> {deal.pricePerUnit} SAR</p>
//           <p><strong>Est. Delivery Window:</strong> {deal.deliveryTime}</p>
//         </div>
//       </div>

//       <div className="mt-6">
//         <h3 className="font-semibold mb-1">Notes</h3>
//         <p className="text-gray-600">{deal.notes}</p>
//       </div>

//       <div className="mt-4 flex justify-end gap-2">
//         <button className="border px-4 py-2">Close Deal</button>
//         <button className="bg-[#F15625] text-white px-4 py-2 rounded">Edit Deal</button>
//       </div>
//     </div>
//   );
// }

// app/deals/[id]/page.jsx  (Next‑13/14/15 app router)
import { notFound } from "next/navigation";
import DetailDealBox from "@/app/components/detaildealbox";

async function getDeal(id) {
  const res = await fetch("https://scale-gold.vercel.app/api/items/Allitems", {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await res.json();
  const deals = Array.isArray(data) ? data : data.deals || [];
  return deals.find((d) => d._id === id) || null;
}

export default async function DealDetailPage({ params }) {
  const deal = await getDeal(params.id);

  if (!deal) {
    notFound(); // built‑in 404
  }

  /** ---------- Map API fields → <DetailDealBox/> props ---------- */
  const progressPct = Math.min((deal.minorder / deal.quantityOrder) * 100, 100);

  return (
    <DetailDealBox
      image={deal.featureImage}
      images={deal.images ?? []}
      title={deal.title?.en}
      price={`${deal.pricePerUnit}/Unit`}
      pricePerUnit={`${deal.pricePerUnit} SAR`}
      location={deal.location?.en}
      timeLeft={timeLeftUntil(deal.endDate)}
      progress={progressPct.toFixed(0)}
      supplierName={deal.supplier?.en}
      minOrder={`${deal.minorder} Units`}
      termsAndNotes={`${deal.termsAndNotes?.en}`}
      deliveryTimeframe={`${formatDate(deal.startDate)} — ${formatDate(
        deal.endDate
      )}`}
      delivery={deal.termsEn ?? "—"}
    />
  );
}

/* --------‑ tiny helpers (kept local so no extra imports) ---- */
function timeLeftUntil(endStr) {
  const diff = new Date(endStr) - new Date();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${d} days:${h} hours`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
