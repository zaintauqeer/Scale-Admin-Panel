"use client";
import React from "react";

const TotalDealsTable = ({
  deals,
  searchTerm,
  menuOpenId,
  setMenuOpenId,
  handleEdit,
  setSelectedDealId,
  setShowCloseModal,
  calculateTimeLeft,
}) => {
  const filteredDeals = deals.filter((deal) =>
    (deal.title?.en || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-1 border-gray-300 p-3 mt-4 rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[16px] font-semibold">Total Deals</h3>

        <div className="relative w-[436px]">
          <input
            type="search"
            placeholder="Search here"
            className="border border-gray-300 placeholder-gray-400 p-2 rounded-sm w-full text-sm pr-10"
            readOnly // prevent errors since input isn't connected to state
          />
          <img
            src="/search icon.svg"
            alt="search icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
        </div>

        <div className="px-3 py-2 text-sm border border-gray-400 rounded-sm text-gray-400">
          <select className="bg-transparent focus:outline-none">
            <option value="">This Week</option>
          </select>
        </div>
      </div>

      <table className="w-full text-left border border-gray-300">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-3 font-semibold text-sm">Deals</th>
            <th className="py-2 px-3 font-semibold text-sm">Buyers Joined</th>
            <th className="py-2 px-3 font-semibold text-sm">Status</th>
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
                    style={{
                      boxShadow: "inset 0px 0px 8px rgba(0,0,0,0.4)",
                    }}
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
                      width: `${
                        deal.quantityOrder > 0
                          ? Math.min(
                              (deal.minorder / deal.quantityOrder) * 100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </td>
              <td className="py-2 px-3 text-sm">
                {calculateTimeLeft(deal.endDate)}
              </td>
              <td className="py-2 px-3 text-sm relative">
                <div className="flex mx-4">
                  <button
                    className="text-blue-500"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === deal._id ? null : deal._id)
                    }
                  >
                    <img
                      src="/actions.svg"
                      alt="actions"
                      className="h-5 w-5"
                    />
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

export default TotalDealsTable;
