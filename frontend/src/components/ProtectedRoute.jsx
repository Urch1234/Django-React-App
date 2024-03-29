import  { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
    const [isAuthorised, setIsAuthorised] = useState(null);

    const getRefreshToken = useCallback(() => {
        return localStorage.getItem(REFRESH_TOKEN);
    }, []);

    const auth = useCallback(async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            setIsAuthorised(false);
            return;
        }
        const token = localStorage.getItem(ACCESS_TOKEN);
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorised(true);
        }
    }, [getRefreshToken]);

    useEffect(() => {
        auth();
    }, [auth]);

    if (isAuthorised === null) {
        return <div>Loading...</div>;
    }

    return isAuthorised ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;