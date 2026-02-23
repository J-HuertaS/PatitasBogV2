import { useState } from "react";
import { userService } from "../../services/userService";
const RegisterUser = () => {
  const [userCreationResponse, setUserCreationResponse] = useState(null);
  const newUserObj = {
    full_name: "Usuario Prueba 503",
    email: "userprueba@ejemplo.com", //cambiar correo cada vez que se registre un nuevo usuario
    password: "Cisco123",
  };
  userService
    .registerUser(newUserObj)
    .then((response) => {
      console.log("User registered successfully:", response);
      setUserCreationResponse(response);
    })
    .catch((error) => {
      console.error("Error registering user:", error);
    });
  return (
    <div>
      <h1>Register User Test</h1>
      {userCreationResponse ? (
        <div>
          <h2>User Created Successfully</h2>
          <p>ID: {userCreationResponse._id}</p>
          <p>Name: {userCreationResponse.full_name}</p>
          <p>Email: {userCreationResponse.email}</p>
        </div>
      ) : (
        <p>Creating user...</p>
      )}
    </div>
  );
};

export default RegisterUser;
