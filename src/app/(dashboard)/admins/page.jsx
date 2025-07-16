"use client";
import React, { useState, useEffect } from "react";
import AddAdminModal from "@/app/components/addAdmin";
import { getAdmins } from "@/lib/getAdmins";
import { useSession } from "next-auth/react";
import { deleteAdmin } from "@/lib/deleteAdmin";
import Swal from "sweetalert2";
import { redirect } from "next/navigation";

const Admins = () => {
    const { data: session } = useSession();
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null); // State for selected admin

    useEffect(() => {
        if (session?.user?.token) {
            getAdmins(session?.user?.token).then((data) => {
                setAdmins(data);
            });
        }
    }, [session]);
    useEffect(() => {
        if (session?.user?.role == "admin") {
            redirect("/");
        }
    }, [session]);

    async function onDelete(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f15525",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
            deleteAdmin(id, session?.user?.token).then(() => {
                setAdmins(admins.filter((admin) => admin._id !== id));
                Swal.fire("Deleted!", "Admin has been deleted.", "success");
            });
        }
    }

    // Handle edit button click
    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAdmin(null);
    };

    // Handle admin added or updated
    const handleAdminUpdated = (updatedAdmin) => {
        console.log(updatedAdmin)
        if (selectedAdmin) {
            // Update existing admin
            setAdmins(admins.map((admin) => (admin._id === updatedAdmin.user._id ? updatedAdmin.user : admin)));
        } else {
            // Add new admin
            setAdmins([...admins, updatedAdmin.user]);
        }
    };

    return (
        <div className="p-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-black">Admins</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans"
                >
                    <img src="/plus.svg" alt="plus" />
                    Add Admin
                </button>
            </div>

            <div className="p-4 border rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[16px] font-semibold text-black">Admin</h3>
                    <div className="relative w-[436px]">
                        <input
                            type="search"
                            placeholder="Search by admin"
                            className="border border-[#DDDDDD] placeholder-gray-400 p-2 rounded-sm w-full text-sm pr-10 text-gray-600"
                        />
                        <img
                            src="/Search icon.svg"
                            alt="search icon"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500"
                        />
                    </div>
                </div>

                <table className="w-full border border-gray-200 text-sm">
                    <thead className="text-gray-700 bg-gray-50">
                        <tr>
                            <th className="py-2 px-4">S.No</th>
                            <th className="py-2 px-6">Username</th>
                            <th className="py-2 px-6">Email</th>
                            <th className="py-2 px-6">Role</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index) => (
                            <tr key={admin._id} className="text-center">
                                <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                                <td className="py-2 px-6 border-b border-gray-200">{admin.username}</td>
                                <td className="py-2 px-6 border-b border-gray-200">{admin.email}</td>
                                <td className="py-2 px-6 border-b border-gray-200">{admin.role}</td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(admin)}
                                            className="text-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(admin._id)}
                                            className="text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <AddAdminModal
                    closeModal={handleCloseModal}
                    admin={selectedAdmin}
                    onAdminUpdated={handleAdminUpdated}
                />
            )}
        </div>
    );
};

export default Admins;