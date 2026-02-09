export const debugAuthState = () => {
  console.log(' VÉRIFICATION AUTHENTIFICATION ');
  console.log('Token:', localStorage.getItem('token') || 'Absent');
  console.log('User ID:', localStorage.getItem('userId') || ' Absent');
  console.log('User Name:', localStorage.getItem('userName') || ' Absent');
  console.log('User Role:', localStorage.getItem('userRole') || ' Absent');
  console.log('Profile Image:', localStorage.getItem('profileImage') || ' Absent');
};

export const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  const isAuth = !!(token && userId);
  
  if (!isAuth) {
    console.warn(' Utilisateur non authentifié!');
    console.warn('Token présent:', !!token);
    console.warn('UserId présent:', !!userId);
  }
  
  return isAuth;
};

export const requireAuth = (navigate) => {
  if (!isUserAuthenticated()) {
    console.error(' Authentification requise - Redirection vers /login');
    navigate('/login');
    return false;
  }
  return true;
};

export const clearAuthData = () => {
  console.log(' Nettoyage des données d\'authentification');
  localStorage.clear();
};