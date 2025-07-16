
import Swal from "sweetalert2";
export async function deleteAdmin(id,token) {
        try {
            const res = await fetch(`https://scale-gold.vercel.app/api/admins/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Failed to delete admin");
            }
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Admin deleted successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong!",
            });
            console.log(error.message)
        }
    }