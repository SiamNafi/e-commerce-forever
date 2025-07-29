// route for user login
const login = async (req, res) => {
  res.send("login");
};

// route for user register
const register = async (req, res) => {
  res.send("register");
};

// route for admin login
const adminLogin = async (req, res) => {
  res.send("admin login");
};

export { login, register, adminLogin };
