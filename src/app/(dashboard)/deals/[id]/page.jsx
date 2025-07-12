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
    notFound(); // Show 404 page if deal not found
  }

  return <DetailDealBox deal={deal} />;
}


/* --------‑ tiny helpers (kept local so no extra imports) ---- */
function timeLeftUntil(endStr) {
  const diff = new Date(endStr) - new Date();
  if (diff <= 0) return "Completed";
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
