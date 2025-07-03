import React, { useRef, useState } from "react";

const CreateDealModal = ({ closeModal }) => {
  const fileFeatureRef = useRef(); // feature image
  const fileImagesRef = useRef(); // additional images

  /* ---------- state ---------- */
  const [imagePreview, setImagePreview] = useState(null); // preview for featureImage
  const [featureImage, setFeatureImage] = useState(null); // <‑‑ new
  const [images, setImages] = useState([]); // <‑‑ new

  const [title, setTitle] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [quantityOrder, setQuantityOrder] = useState(""); // <‑‑ new
  const [minBuyers, setMinBuyers] = useState("");

  const [supplierEn, setSupplierEn] = useState("");
  const [supplierAr, setSupplierAr] = useState(""); // <‑‑ new

  const [paymentEn, setPaymentEn] = useState("");
  const [paymentAr, setPaymentAr] = useState(""); // <‑‑ new

  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState(""); // <‑‑ new

  const [terms, setTerms] = useState(""); // duplicates for En/Ar

  const [notes, setNotes] = useState("");

  const [whatsappEn, setWhatsappEn] = useState("");
  const [whatsappAr, setWhatsappAr] = useState("");
  const [prefillEn, setPrefillEn] = useState("");
  const [prefillAr, setPrefillAr] = useState(""); // <‑‑ new

  /* ---------- handlers ---------- */
  const triggerFeatureInput = () => fileFeatureRef.current.click();
  const triggerImagesInput = () => fileImagesRef.current.click();

  const handleFeatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeatureImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e) => setImages(Array.from(e.target.files || []));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Please log in first.");

      const formData = new FormData();

      // Use English values for both English and Arabic fields
      formData.append("titleEn", title);
      formData.append("titleAr", title);
      formData.append("locationEn", "Riyadh, Saudi Arabia");
      formData.append("locationAr", "الرياض، السعودية");

      formData.append("minorder", String(minOrderQty));
      formData.append("minRequiredBuyers", String(minBuyers));
      formData.append("quantityOrder", String(minOrderQty)); // assuming same as minOrderQty
      formData.append("pricePerUnit", pricePerUnit);

      formData.append("supplierEn", supplierEn);
      formData.append("supplierAr", supplierAr);
      formData.append("descriptionEn", descriptionEn);
      formData.append("descriptionAr", descriptionAr);
      formData.append("termsEn", notes);
      formData.append("termsAr", notes);
      formData.append("startDate", String(startDate));
      formData.append("endDate", String(endDate));
      formData.append("paymentEn", paymentEn);
      formData.append("paymentAr", paymentAr);
      formData.append("whatsappEn", whatsappEn);
      formData.append("whatsappAr", whatsappAr);
      formData.append("prefillEn", prefillEn);
      formData.append("prefillAr", prefillAr);

      // Add feature image (first file)
      // ---------- images ----------
      const featureFile = fileFeatureRef.current?.files?.[0];
      if (featureFile) {
        formData.append("featureImage", featureFile);
      }

      const extraFiles = fileImagesRef.current?.files || [];
      for (let i = 0; i < extraFiles.length; i++) {
        formData.append("images", extraFiles[i]);
      }

      const res = await fetch(
        "https://scale-gold.vercel.app/api/items/Create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json().catch(() => ({}));
      console.log("Server response:", data);

      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      alert("Deal created successfully!");
      closeModal();

      if (typeof refreshDeals === "function") {
        refreshDeals();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  /*  ====== JSX ======  */
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="bg-white w-full max-w-[610px] max-h-[90vh] overflow-y-auto rounded-sm">
        <h2 className="text-xl mb-4 font-[600] border-b border-b-gray-300 px-3 py-2">
          Create Deal
        </h2>

        <div className="bg-white m-4 p-4 border border-gray-300 rounded-sm relative">
          {/* ------------ feature image ------------- */}
          <div
            className="w-26 h-26 mx-auto mb-4 border border-dotted rounded-full flex items-center justify-center cursor-pointer bg-gray-200 overflow-hidden"
            onClick={triggerFeatureInput}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <img src="/camera.svg" alt="camera" className="w-8 h-8" />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileFeatureRef}
              onChange={handleFeatureChange}
              className="hidden"
            />
          </div>

          {/* upload more images button */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={triggerImagesInput}
              className="px-3 py-1 border border-gray-400 rounded text-sm"
            >
              Add more images
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileImagesRef}
              onChange={handleImagesChange}
              className="hidden"
            />
          </div>

          <p className="text-center text-[#F15625] mb-4">
            Please upload product images
          </p>

          {/* ------------ TITLE ------------ */}
          <div className="grid gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm">Deal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deal title"
                className="border p-2 rounded text-sm w-full"
              />
            </div>

            {/* ------------ Pricing row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Market Price</label>
                <input
                  type="text"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="Market Price"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Price per unit</label>
                <input
                  type="text"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="Price per unit"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>

            {/* ------------ Quantity / Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Minimum order quantity
                </label>
                <input
                  type="text"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  placeholder="Minimum order quantity"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Quantity per buyer
                </label>
                <input
                  type="text"
                  value={quantityOrder}
                  onChange={(e) => setQuantityOrder(e.target.value)}
                  placeholder="Quantity per buyer"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">
                  Minimum required buyers
                </label>
                <input
                  type="text"
                  value={minBuyers}
                  onChange={(e) => setMinBuyers(e.target.value)}
                  placeholder="Min required buyers"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>

            {/* ------------ Supplier row ------------ */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Supplier (EN)</label>
                <input
                  type="text"
                  value={supplierEn}
                  onChange={(e) => setSupplierEn(e.target.value)}
                  placeholder="Supplier name in English"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm">Supplier (AR)</label>
                <input
                  type="text"
                  value={supplierAr}
                  onChange={(e) => setSupplierAr(e.target.value)}
                  placeholder="اسم المورد بالعربية"
                  className="border p-2 rounded text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* ------------ Delivery Window ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Estimated Delivery Window
            </label>
            <input
              type="text"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
              placeholder="Estimated Delivery Window"
              className="border p-2 rounded text-sm w-full"
            />
          </div>

          {/* ------------ Delivery Area & Dates ------------ */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">
                Delivery Area
              </label>
              <input
                type="text"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-sm block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded text-sm w-full text-gray-400"
              />
            </div>
          </div>

          {/* ------------ Description ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Description (EN)</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Add Description"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">الوصف (AR)</label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="أضف وصفًا"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Notes ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Add Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add Notes"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Terms ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Add Terms & Conditions"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Payment instructions ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Payment Instructions (EN)
            </label>
            <textarea
              value={paymentEn}
              onChange={(e) => setPaymentEn(e.target.value)}
              placeholder="Payment Instructions"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">تعليمات الدفع (AR)</label>
            <textarea
              value={paymentAr}
              onChange={(e) => setPaymentAr(e.target.value)}
              placeholder="تعليمات الدفع"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ Prefilled messages ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              Prefilled message (EN)
            </label>
            <textarea
              value={prefillEn}
              onChange={(e) => setPrefillEn(e.target.value)}
              placeholder="Prefilled message"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              الرسالة المعبأة مسبقًا (AR)
            </label>
            <textarea
              value={prefillAr}
              onChange={(e) => setPrefillAr(e.target.value)}
              placeholder="رسالة واتساب عربية"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ WhatsApp share message ------------ */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm">
              WhatsApp Message (EN)
            </label>
            <textarea
              value={whatsappEn}
              onChange={(e) => setWhatsappEn(e.target.value)}
              placeholder="WhatsApp message in English"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm">رسالة واتساب (AR)</label>
            <textarea
              value={whatsappAr}
              onChange={(e) => setWhatsappAr(e.target.value)}
              placeholder="رسالة واتساب بالعربية"
              className="border p-2 w-full rounded text-sm"
              rows={2}
            />
          </div>

          {/* ------------ action buttons ------------ */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-400 rounded text-[16px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#f15525] text-white rounded text-[16px]"
            >
              Post Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDealModal;
