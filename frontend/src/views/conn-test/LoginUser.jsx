import { useState } from "react";
import { userService } from "../../services/userService";
const LoginUser = () => {
  const [userLogin, setUserLogin] = useState(null);
  const userCredentials = {
    email: "userprueba@ejemplo.com",
    password: "Cisco123",
  };

  userService
    .loginUser(userCredentials)
    .then((response) => {
      console.log("User logged in successfully:", response);
      setUserLogin(response);
      localStorage.setItem("token", response.token);
    })
    .catch((error) => {
      console.error("Error logging in user:", error);
    });

  return (
    <div>
      <h1>Login User Test</h1>
      {userLogin ? (
        <div>
          <h2>User Logged In Successfully</h2>
          <p>ID: {userLogin._id}</p>
          <p>Name: {userLogin.full_name}</p>
          <p>Email: {userLogin.email}</p>
          <p>Token: {userLogin.token}</p>
          {localStorage.getItem("token") && (
            <p>Token stored in localStorage: {localStorage.getItem("token")}</p>
          )}
        </div>
      ) : (
        <p>Logging in user...</p>
      )}
    </div>
  );
};

export default LoginUser;
