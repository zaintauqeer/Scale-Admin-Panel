const getUserFromDb = async (identifier, password) => {
  try {
    const res = await fetch("https://scale-gold.vercel.app/api/admins/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      return null; // invalid credentials or server error
    }

    const data = await res.json();

    console.log(data)
    
    // Ensure user data is returned in a format NextAuth expects
    // e.g., { id, name, email, image }
    if (data && data.user) {
      return {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };
    }

    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export default getUserFromDb
