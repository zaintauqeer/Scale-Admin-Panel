import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { updateAdmin } from "@/lib/updateAdmin";

const AddAdminModal = ({ closeModal, admin, onAdminUpdated }) => {
    const modalRef = useRef();
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const isEdit = !!admin; 

    useEffect(() => {
        if (isEdit && admin) {
            setFormData({
                username: admin.username || "",
                email: admin.email || "",
                password: "", // Leave password empty for security
            });
        }
    }, [admin, isEdit]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = session?.user?.token;
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "You are not authorized to perform this action!",
            });
            setIsLoading(false);
            return;
        }

        try {
            let response;
            if (isEdit) {
                // Update admin
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    ...(formData.password && { password: formData.password }), // Only include password if provided
                };
                response = await updateAdmin(admin._id, updateData, token);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Admin updated successfully!",
                });
            } else {
                // Create new admin
                response = await fetch("https://scale-gold.vercel.app/api/admins/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create admin");
                }
                response = await response.json();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Admin created successfully!",
                });
            }

            onAdminUpdated(response); // Notify parent component
            closeModal();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong!",
            });
        } finally {
            setIsLoading(false);
        }
    };


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
                    {isEdit ? "Edit Admin" : "Add Admin"}
                </h2>
                <form onSubmit={handleSubmit} className="m-4 p-4 border border-gray-300 rounded-sm">
                    <div className="grid gap-4 mb-4">
                        <div>
                            <label className="text-gray-500 text-sm">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                                className="border p-2 rounded text-sm w-full placeholder-gray-300 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="border p-2 rounded text-sm w-full placeholder-gray-300 text-black"
                                required
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-gray-500 text-sm">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={isEdit ? "New Password (optional)" : "Password"}
                                    className="border p-2 rounded text-sm w-full placeholder-gray-300 text-black"
                                    required={!isEdit} // Password not required for edit
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex gap-x-2 bg-[#f15525] px-4 py-2 text-[16px] rounded-sm text-white public-sans ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Admin" : "Create Admin")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdminModal;