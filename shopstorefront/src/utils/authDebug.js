export const debugAuth = () => {
  console.log(' DEBUG AUTHENTIFICATION ');
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  console.log('Token présent:', !!token);
  console.log('Token (premiers 50 chars):', token ? token.substring(0, 50) + '...' : 'AUCUN');
  console.log('User ID:', userId);
  console.log('User Name:', userName);
  console.log('User Role:', userRole);
  
  console.log('\nToutes les clés dans localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
  }
  
  console.log(' FIN DEBUG \n');
  
  return {
    hasToken: !!token,
    token: token,
    userId: userId,
    userName: userName,
    userRole: userRole
  };
};

export const testAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error(' Aucun token trouvé dans localStorage');
    return null;
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  console.log(' Headers qui seront envoyés:', headers);
  return headers;
};