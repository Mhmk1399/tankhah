const handleTokenExpiration = (error: Error) => {
  if (error.name === 'TokenExpiredError') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};
export default handleTokenExpiration;