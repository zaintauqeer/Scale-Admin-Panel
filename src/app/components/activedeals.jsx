"use client";
import React from "react";

const ActiveDealsTable = ({
  deals,
  searchTerm,
  calculateTimeLeft,
  menuOpenId,
  setMenuOpenId,
  setSelectedDealId,
  setShowCloseModal,
  handleEdit
}) => {
    const filteredDeals = deals.filter((deal) =>
  (deal.title?.en || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  

  return (
    <div className="border-1 border-gray-300 p-3 mt-4 rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[16px] font-semibold">Active Deals</h3>
      </div>

      <table className="w-full text-left border border-gray-300 relative">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-3 font-semibold text-sm">Products</th>
            <th className="py-2 px-3 font-semibold text-sm">Buyers Joined</th>
            <th className="py-2 px-3 font-semibold text-sm">Time Left</th>
            <th className="py-2 px-3 font-semibold text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map((deal) => (
            <tr key={deal._id} className="border-b border-gray-200 relative">
              <td className="py-2 px-3 text-sm flex items-center gap-3">
                {deal.featureImage && (
                  <div
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
                    style={{ boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)" }}
                  >
                    <img
                      src={deal.featureImage}
                      alt="feature"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
                <span>{deal.title?.en}</span>
              </td>
              <td className="py-2 px-3 text-sm">
                {deal.minorder}/{deal.quantityOrder}
                <div className="w-60 h-2 rounded-lg bg-gray-300 border border-gray-300 overflow-hidden">
                  <div
                    className="h-2 rounded-lg bg-orange-500"
                    style={{
                      width: `${Math.min(
                        (deal.minorder / deal.quantityOrder) * 100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              </td>
              <td className="py-2 px-3 text-sm">{calculateTimeLeft(deal.endDate)}</td>
              <td className="py-2 px-3 text-sm relative">
                <div className="flex mx-4">
                  <button
                    className="text-blue-500"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === deal._id ? null : deal._id)
                    }
                  >
                    <img src="/actions.svg" alt="actions" className="h-5 w-5" />
                  </button>
                </div>

                {menuOpenId === deal._id && (
                  <div className="absolute right-16 top-8 bg-white border border-gray-300 rounded-md shadow-md z-10 w-32">
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                      onClick={() => handleEdit(deal._id)}
                    >
                      Edit Deal
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedDealId(deal._id);
                        setShowCloseModal(true);
                        setMenuOpenId(null);
                      }}
                    >
                      Close Deal
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveDealsTable;
