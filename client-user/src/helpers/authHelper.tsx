export function isAuthenticated() {
  // Check if the user is authenticated
  // Return true if authenticated, false otherwise
  // You can implement your own logic here based on how you store the authentication state
  const isLoggedIn = localStorage.getItem("loggedin");
  return isLoggedIn === "true";
}
