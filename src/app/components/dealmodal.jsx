import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const CreateDealModal = ({ closeModal, refreshDeals }) => {
  const fileFeatureRef = useRef();
  const fileImagesRef = useRef();
  const modalRef = useRef();
  const { data: session } = useSession();

  /* ---------- State ---------- */
  const [imagePreview, setImagePreview] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState({ en: "", ar: "" });
  const [marketPrice, setMarketPrice] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [quantityOrder, setQuantityOrder] = useState("");
  const [minBuyers, setMinBuyers] = useState("");
  const [location, setLocation] = useState({ en: "", ar: "" });
  const [supplier, setSupplier] = useState({ en: "", ar: "" });
  const [paymentInstructions, setPaymentInstructions] = useState({
    en: "",
    ar: "",
  });
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [interval, setInterval] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState({ en: "", ar: "" });
  const [termsAndNotes, setTermsAndNotes] = useState({ en: "", ar: "" });
  const [notes, setNotes] = useState({ en: "", ar: "" });
  const [whatsappMessages, setWhatsappMessages] = useState({ en: "", ar: "" });
  const [prefilledMessages, setPrefilledMessages] = useState({
    en: "",
    ar: "",
  });
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  /* ---------- Derived State ---------- */
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) || {
    en: "",
    ar: "",
    id: "",
  };
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  ) || { en: "", ar: "", id: "" };

  /* ---------- Handlers ---------- */
  const triggerFeatureInput = () => fileFeatureRef.current.click();
  const triggerImagesInput = () => fileImagesRef.current.click();

  const handleFeatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Feature image must be a valid image file (e.g., PNG, JPEG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Feature image must be less than 5MB.");
      return;
    }
    setFeatureImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError(
        "All additional images must be valid image files (e.g., PNG, JPEG)."
      );
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each additional image must be less than 5MB.");
      return;
    }
    setImages(files);
    setError("");
  };

  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    const unit = units.find((u) => u.id === unitId);
    if (unitId && !unit) {
      setError("Selected unit is invalid.");
      setSelectedUnitId("");
      return;
    }
    setSelectedUnitId(unitId);
    setError("");
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id === categoryId);
    if (categoryId && !category) {
      setError("Selected category is invalid.");
      setSelectedCategoryId("");
      return;
    }
    setSelectedCategoryId(categoryId);
    setError("");
  };

  const validateArabic = (text) => /[\u0600-\u06FF]/.test(text);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const token = session?.user?.token;
      if (!token) throw new Error("Please log in first.");

      // Client-side validation
      if (!title.en || !title.ar)
        throw new Error("Deal title in both languages is required.");
      if (!validateArabic(title.ar))
        throw new Error("Title (AR) must be in Arabic.");
      if (!marketPrice || isNaN(marketPrice) || Number(marketPrice) <= 0)
        throw new Error("Valid market price is required.");
      if (!pricePerUnit || isNaN(pricePerUnit) || Number(pricePerUnit) <= 0)
        throw new Error("Valid price per unit is required.");
      if (!minOrderQty || isNaN(minOrderQty) || Number(minOrderQty) <= 0)
        throw new Error("Valid minimum order quantity is required.");
      if (!quantityOrder || isNaN(quantityOrder) || Number(quantityOrder) <= 0)
        throw new Error("Valid quantity per order is required.");
      if (!minBuyers || isNaN(minBuyers) || Number(minBuyers) <= 0)
        throw new Error("Valid minimum required buyers is required.");
      if (!location.en || !location.ar)
        throw new Error("Location in both languages is required.");
      if (!validateArabic(location.ar))
        throw new Error("Location (AR) must be in Arabic.");
      if (!supplier.en || !supplier.ar)
        throw new Error("Supplier names in both languages are required.");
      if (!validateArabic(supplier.ar))
        throw new Error("Supplier (AR) must be in Arabic.");
      if (!description.en || !description.ar)
        throw new Error("Descriptions in both languages are required.");
      if (!validateArabic(description.ar))
        throw new Error("Description (AR) must be in Arabic.");
      if (!termsAndNotes.en || !termsAndNotes.ar)
        throw new Error("Terms and conditions in both languages are required.");
      if (!validateArabic(termsAndNotes.ar))
        throw new Error("Terms (AR) must be in Arabic.");
      if (!notes.en || !notes.ar)
        throw new Error("Notes in both languages are required.");
      if (!validateArabic(notes.ar))
        throw new Error("Notes (AR) must be in Arabic.");
      if (!paymentInstructions.en || !paymentInstructions.ar)
        throw new Error("Payment instructions in both languages are required.");
      if (!validateArabic(paymentInstructions.ar))
        throw new Error("Payment Instructions (AR) must be in Arabic.");
      if (!whatsappMessages.en || !whatsappMessages.ar)
        throw new Error("WhatsApp messages in both languages are required.");
      if (!validateArabic(whatsappMessages.ar))
        throw new Error("WhatsApp Message (AR) must be in Arabic.");
      if (!prefilledMessages.en || !prefilledMessages.ar)
        throw new Error("Prefilled messages in both languages are required.");
      if (!validateArabic(prefilledMessages.ar))
        throw new Error("Prefilled Message (AR) must be in Arabic.");
      if (!startDate || !endDate)
        throw new Error("Start and end dates are required.");
      if (new Date(startDate) > new Date(endDate))
        throw new Error("Start date must be before or equal to end date.");
      if (
        !selectedUnitId ||
        !units.find((unit) => unit.id === selectedUnitId)
      ) {
        throw new Error("A valid unit is required.");
      }
      if (!validateArabic(selectedUnit.ar))
        throw new Error("Selected unit must have a valid Arabic name.");
      if (
        !selectedCategoryId ||
        !categories.find((cat) => cat.id === selectedCategoryId)
      ) {
        throw new Error("A valid category is required.");
      }
      if (!validateArabic(selectedCategory.ar))
        throw new Error("Selected category must have a valid Arabic name.");
      if (!featureImage) throw new Error("Feature image is required.");
      if (!images.length)
        throw new Error("At least one additional image is required.");

      const formData = new FormData();
      formData.append("titleEn", title.en);
      formData.append("titleAr", title.ar);
      formData.append("marketPrice", Number(marketPrice));
      formData.append("pricePerUnit", Number(pricePerUnit));
      formData.append("minorder", Number(minOrderQty));
      formData.append("quantityOrder", Number(quantityOrder));
      formData.append("minRequiredBuyers", Number(minBuyers));
      formData.append("locationEn", location.en);
      formData.append("locationAr", location.ar);
      formData.append("supplierEn", supplier.en);
      formData.append("supplierAr", supplier.ar);
      formData.append("descriptionEn", description.en);
      formData.append("descriptionAr", description.ar);
      formData.append("termsEn", termsAndNotes.en);
      formData.append("termsAr", termsAndNotes.ar);
      formData.append("notesEn", notes.en);
      formData.append("notesAr", notes.ar);
      formData.append("paymentEn", paymentInstructions.en);
      formData.append("paymentAr", paymentInstructions.ar);
      formData.append("whatsappEn", whatsappMessages.en);
      formData.append("whatsappAr", whatsappMessages.ar);
      formData.append("prefillEn", prefilledMessages.en);
      formData.append("prefillAr", prefilledMessages.ar);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("unitEn", selectedUnit.en);
      formData.append("unitAr", selectedUnit.ar);
      formData.append("unitId", selectedUnitId);
      formData.append("categoryEn", selectedCategory.en);
      formData.append("categoryAr", selectedCategory.ar);
      formData.append("categoryId", selectedCategoryId);
      formData.append("deliveryWindow", deliveryWindow || "");
      formData.append("interval", interval);
      formData.append("status", "active");

      if (!featureImage.type.startsWith("image/")) {
        throw new Error("Feature image must be a valid image file.");
      }
      formData.append("featureImage", featureImage);
      images.forEach((image) => {
        if (!image.type.startsWith("image/")) {
          throw new Error("All additional images must be valid image files.");
        }
        formData.append("images", image);
      });

      // Log payload for debugging
      console.log("FormData payload:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
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

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { message: "Failed to parse server response" };
      }

      if (!res.ok) {
        console.error("Server response:", data);
        throw new Error(
          data.message || `HTTP Error ${res.status}: Server error`
        );
      }

      //--------------Swal

      Swal.fire({
        title: "Deal Created successfully!",
        icon: "success",
        confirmButtonColor: "#f15525", // your custom color (orange)
      });

      closeModal();
      if (typeof refreshDeals === "function") {
        await refreshDeals();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(`Failed to create deal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  //----------------------------------Fetch Units
  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoadingUnits(true);
      setError("");
      try {
        const token = session?.user?.token;
        if (!token) {
          setError("Please log in to load units.");
          return;
        }
        const res = await fetch(
          "https://scale-gold.vercel.app/api/getAllUnits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch units: ${res.status}`);
        }
        const result = await res.json();
        console.log("Raw units response:", result);
        if (!Array.isArray(result) || result.length === 0) {
          setError("No units available.");
          return;
        }
        const validUnits = result
          .filter(
            (unit) =>
              unit._id &&
              unit.name_en &&
              unit.name_ar &&
              /[\u0600-\u06FF]/.test(unit.name_ar)
          )
          .map((unit) => ({
            id: unit._id,
            en: unit.name_en,
            ar: unit.name_ar,
          }));
        console.log("Filtered units:", validUnits);
        if (validUnits.length === 0) {
          setError("No valid units found.");
          return;
        }
        setUnits(validUnits);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError(`Failed to load units: ${err.message}`);
      } finally {
        setIsLoadingUnits(false);
      }
    };
    fetchUnits();
  }, [session]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError("");
      try {
        const token = session?.user?.token;
        if (!token) {
          setError("Please log in to load categories.");
          return;
        }
        console.log("Auth token:", token.slice(0, 10) + "...");
        const res = await fetch(
          "https://scale-gold.vercel.app/api/getAllCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        const result = await res.json();
        console.log("Raw categories response:", result);
        if (!Array.isArray(result) || result.length === 0) {
          setError("No categories available.");
          return;
        }
        const validCategories = result
          .filter(
            (cat) =>
              cat._id &&
              cat.name_en &&
              cat.name_ar &&
              /[\u0600-\u06FF]/.test(cat.name_ar)
          )
          .map((cat) => ({
            id: cat._id,
            en: cat.name_en,
            ar: cat.name_ar,
          }));
        console.log("Filtered categories:", validCategories);
        if (validCategories.length === 0) {
          setError("No valid categories found.");
          return;
        }
        setCategories(validCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(`Failed to load categories: ${err.message}`);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  /* JSX */
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/80">
      <div
        className="bg-white w-full max-w-[610px] max-h-[90vh] overflow-y-auto rounded-sm"
        ref={modalRef}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <h2
          id="modal-title"
          className="text-xl font-medium border-b border-gray-300 px-3 py-3 text-black"
        >
          Create Deal
        </h2>
        <div className="m-4 p-4 border border-gray-300 rounded-sm">
          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
          {/* Feature Image */}
          <div
            className="w-24 h-24 mx-auto mb-4 border border-dotted rounded-full flex items-center justify-center cursor-pointer bg-gray-200 overflow-hidden"
            onClick={triggerFeatureInput}
            role="button"
            aria-label="Upload feature image"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Feature preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src="/camera.svg"
                alt="Upload camera icon"
                className="w-8 h-8"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileFeatureRef}
              onChange={handleFeatureChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          {/* Upload More Images Button */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={triggerImagesInput}
              className="px-3 py-1 border border-gray-400 rounded text-sm text-black"
              aria-label="Upload additional images"
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
              aria-hidden="true"
            />
          </div>
          <p className="text-center text-[#F15625] mb-4">
            Please upload product images
          </p>
          {/* Title */}
          <div className="grid gap-4 mb-4">
            <div>
              <label className="text-gray-500 text-sm">Deal Title (EN)</label>
              <input
                type="text"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                placeholder="Deal title"
                className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
              />
              {/* {!title.en && <p className="text-red-500 text-sm mt-1">Title (EN) is required</p>} */}
            </div>
            <div>
              <label className="text-gray-500 text-sm">Deal Title (AR)</label>
              <input
                type="text"
                value={title.ar}
                onChange={(e) => setTitle({ ...title, ar: e.target.value })}
                placeholder="عنوان الصفقة"
                className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black "}`}
              />
            </div>
            {/* Pricing Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Market Price</label>
                <input
                  type="number"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="Market Price"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Price per Unit</label>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="Price per unit"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
            </div>
            {/* Category Dropdowns */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Category (EN)</label>
                {isLoadingCategories ? (
                  <p className="text-gray-500">Loading categories...</p>
                ) : (
                  <select
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    className={`border p-2 rounded text-sm w-full bg-gray-100 text-gray-500 `}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.en}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">الفئة (AR)</label>
                {isLoadingCategories ? (
                  <p className="text-gray-500">جارٍ تحميل الفئات...</p>
                ) : (
                  <select
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    className={`border p-2 rounded text-sm w-full bg-gray-100 text-gray-500 `}
                  >
                    <option value="">اختر فئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.ar}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            {/* Quantity / Unit Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm mb-1 block">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(e.target.value)}
                  placeholder="Minimum order quantity"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Unit (EN)</label>
                {isLoadingUnits ? (
                  <p className="text-gray-500">Loading units...</p>
                ) : (
                  <select
                    value={selectedUnitId}
                    onChange={handleUnitChange}
                    className={`border p-2 rounded text-sm w-full bg-gray-100 text-gray-500 `}
                  >
                    <option value="">Select a unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.en}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">الوحدة (AR)</label>
                {isLoadingUnits ? (
                  <p className="text-gray-500">جارٍ تحميل الوحدات...</p>
                ) : (
                  <select
                    value={selectedUnitId}
                    onChange={handleUnitChange}
                    className={`border p-2 rounded text-sm w-full bg-gray-100 text-gray-500 `}
                  >
                    <option value="">اختر وحدة</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.ar}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            {/* Quantity per Buyer / Min Buyers */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm mb-1 block">
                  Quantity per Buyer
                </label>
                <input
                  type="number"
                  value={quantityOrder}
                  onChange={(e) => setQuantityOrder(e.target.value)}
                  placeholder="Quantity per buyer"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm mb-1 block">
                  Minimum Required Buyers
                </label>
                <input
                  type="number"
                  value={minBuyers}
                  onChange={(e) => setMinBuyers(e.target.value)}
                  placeholder="Min required buyers"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
            </div>
            {/* Location Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Location (EN)</label>
                <input
                  type="text"
                  value={location.en}
                  onChange={(e) =>
                    setLocation({ ...location, en: e.target.value })
                  }
                  placeholder="Location in English (e.g., Karachi)"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">الموقع (AR)</label>
                <input
                  type="text"
                  value={location.ar}
                  onChange={(e) =>
                    setLocation({ ...location, ar: e.target.value })
                  }
                  placeholder="الموقع بالعربية (مثال: كراتشي)"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
            </div>
            {/* Supplier Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm">Supplier (EN)</label>
                <input
                  type="text"
                  value={supplier.en}
                  onChange={(e) =>
                    setSupplier({ ...supplier, en: e.target.value })
                  }
                  placeholder="Supplier name in English"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">المورد (AR)</label>
                <input
                  type="text"
                  value={supplier.ar}
                  onChange={(e) =>
                    setSupplier({ ...supplier, ar: e.target.value })
                  }
                  placeholder="اسم المورد بالعربية"
                  className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-gray-500 text-sm">
                  Estimated Delivery Window
                </label>
                <input
                  type="text"
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  placeholder="Estimated Delivery Window"
                  className="border p-2 rounded text-sm w-full placeholder-gray-300 text-black"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-sm">
                  Set Interval Quantity
                </label>
                <input
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  placeholder="Estimated Delivery Window"
                  className="border p-2 rounded text-sm w-full placeholder-gray-300 text-black"
                />
              </div>
            </div>
          </div>
          {/* Delivery Window */}
          {/* Delivery Dates */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-gray-500 text-sm block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-500 text-sm block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`border p-2 rounded text-sm w-full placeholder-gray-300 text-black `}
              />
            </div>
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">Description (EN)</label>
            <textarea
              value={description.en}
              onChange={(e) =>
                setDescription({ ...description, en: e.target.value })
              }
              placeholder="Add Description"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">الوصف (AR)</label>
            <textarea
              value={description.ar}
              onChange={(e) =>
                setDescription({ ...description, ar: e.target.value })
              }
              placeholder="أضف وصفًا"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* Notes */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">Notes (EN)</label>
            <textarea
              value={notes.en}
              onChange={(e) => setNotes({ ...notes, en: e.target.value })}
              placeholder="Add Notes"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">ملاحظات (AR)</label>
            <textarea
              value={notes.ar}
              onChange={(e) => setNotes({ ...notes, ar: e.target.value })}
              placeholder="أضف ملاحظات"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* Terms */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              Terms & Conditions (EN)
            </label>
            <textarea
              value={termsAndNotes.en}
              onChange={(e) =>
                setTermsAndNotes({ ...termsAndNotes, en: e.target.value })
              }
              placeholder="Add Terms & Conditions"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              الشروط والأحكام (AR)
            </label>
            <textarea
              value={termsAndNotes.ar}
              onChange={(e) =>
                setTermsAndNotes({ ...termsAndNotes, ar: e.target.value })
              }
              placeholder="أضف الشروط والأحكام"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* Payment Instructions */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              Payment Instructions (EN)
            </label>
            <textarea
              value={paymentInstructions.en}
              onChange={(e) =>
                setPaymentInstructions({
                  ...paymentInstructions,
                  en: e.target.value,
                })
              }
              placeholder="Payment Instructions"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">تعليمات الدفع (AR)</label>
            <textarea
              value={paymentInstructions.ar}
              onChange={(e) =>
                setPaymentInstructions({
                  ...paymentInstructions,
                  ar: e.target.value,
                })
              }
              placeholder="تعليمات الدفع"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* Prefilled Messages */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              Prefilled Message (EN)
            </label>
            <textarea
              value={prefilledMessages.en}
              onChange={(e) =>
                setPrefilledMessages({
                  ...prefilledMessages,
                  en: e.target.value,
                })
              }
              placeholder="Prefilled message"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              الرسالة المعبأة مسبقًا (AR)
            </label>
            <textarea
              value={prefilledMessages.ar}
              onChange={(e) =>
                setPrefilledMessages({
                  ...prefilledMessages,
                  ar: e.target.value,
                })
              }
              placeholder="رسالة واتساب عربية"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* WhatsApp Messages */}
          <div className="mb-4">
            <label className="text-gray-500 text-sm">
              WhatsApp Message (EN)
            </label>
            <textarea
              value={whatsappMessages.en}
              onChange={(e) =>
                setWhatsappMessages({ ...whatsappMessages, en: e.target.value })
              }
              placeholder="WhatsApp message in English"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">رسالة واتساب (AR)</label>
            <textarea
              value={whatsappMessages.ar}
              onChange={(e) =>
                setWhatsappMessages({ ...whatsappMessages, ar: e.target.value })
              }
              placeholder="رسالة واتساب بالعربية"
              className={`border p-2 w-full rounded text-sm placeholder-gray-300 text-black `}
              rows={2}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-400 rounded text-[16px] text-black font-sans"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#f15525] text-white rounded text-[16px] font-sans disabled:opacity-50 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Deal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDealModal;
