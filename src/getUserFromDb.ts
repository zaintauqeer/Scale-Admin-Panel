const getUserFromDb = async (identifier: string, password: string) => {
  try {
    const res = await fetch("https://scale-gold.vercel.app/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: identifier, password }),
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
        name: data.user.name || data.user.identifier,
        identifier: data.user.identifier,
        image: data.user.image || null,
      };
    }

    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export default getUserFromDb
