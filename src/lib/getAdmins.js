export async function getAdmins(token) {
  try {
    const response = await fetch('https://scale-gold.vercel.app/api/admins/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
}
