

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
