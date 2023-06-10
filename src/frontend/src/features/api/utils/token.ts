const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export { setAuthToken, getAuthToken, removeAuthToken };
