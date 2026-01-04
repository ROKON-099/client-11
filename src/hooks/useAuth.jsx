import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider.jsx";

const useAuth = () => useContext(AuthContext);
export default useAuth;
