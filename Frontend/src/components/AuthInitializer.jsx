import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import { getProfile } from "../services/profile.service";

function AuthInitializer({ children }) {

    const dispatch = useDispatch();

    useEffect(() => {

        const initialize = async () => {

            const token = localStorage.getItem("token");

            if (!token) return;

            try {

                const response = await getProfile();

                dispatch(
                    loginSuccess({
                        token,
                        user: response.data.user,
                    })
                );

            } catch (error) {

                localStorage.removeItem("token");

                dispatch(logout());

            }

        };

        initialize();

    }, []);

    return children;

}

export default AuthInitializer;