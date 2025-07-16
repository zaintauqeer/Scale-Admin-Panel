export const updateAdmin = async (id, data, token) => {
    try {
        const response = await fetch(`https://scale-gold.vercel.app/api/admins/update/${id}`, {
            method: "PUT", // Use PATCH or PUT depending on your API
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update admin");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};