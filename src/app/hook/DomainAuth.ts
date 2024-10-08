const DomainAuth = async (domain: string) => {
  try {
    const res = await fetch(`https://${domain}/auth`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });
    return await res.json();
  } catch (err) {
    console.log('Fetch error:', err);
    return null;
  }
};

export default DomainAuth;