import React from "react";

import axios from "axios";
import qs from "qs";
import jwtDecode from "jwt-decode";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./pages/LoginPage";


const code_verifier =
    "O3Ojm1T7R3rm7YTYVzOpK_u9k4O7c.gH9f7iN6vvnoIoPdHk1uZ2TR_ZuCf-4oETpGa3e9r4TUR2xloMwh.26XJzEcm.-cBY.Afzout640qynhSq4HLMyrsBT5tRvLKp";
const code_challenge = "nmdAB9upgOWlf-qY02rWnN7U38rVDw893Se-x21UKYs";

const CLIENT_ID = "c280b4c0-b48c-0139-b237-028559619631125300";
const CLIENT_SECRET =
    "bdd7f799f61ce61ed3f32b5e53a1b7ecd1f5aef235c6c72f70e89a7cdf8abcc9";

const CALLBACK_URL = "http://localhost:3000";

const HomePage = ({ userData }) => {
    const [loading, setLoading] = React.useState(false);

    const fetchUserDetails = () => {
        setLoading(true);
        axios
            .post(
                "http://localhost:4000/lookup",
                {
                    ...userData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((data) => {
                console.log(data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    React.useEffect(() => {
        fetchUserDetails();
    }, []);

    if (loading) {
        return <div> Checking for user existence!</div>;
    }

    return <><div>Welcome {userData.name}</div>
    <div>{JSON.stringify(userData)}</div>
    </>;
        
};

function App() {
    const [isAuthenticated, setAuthenticated] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const fetchAccessToken = async (code) => {
        setLoading(true);
        let params = qs.stringify({
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            code_verifier: code_verifier,
            code: code,
            redirect_uri: CALLBACK_URL,
        });
        axios
            .post(
                "https://gslab-instance-dev.onelogin.com/oidc/2/token",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
            .then((data) => {
                const userToken = data.data;

                const decodedToken = jwtDecode(userToken.id_token);
                console.log(decodedToken);
                setAuthenticated(true);
                setUserInfo(decodedToken);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get("check-login")) {
            // OIDC Auth Code flow
            // Drops with auth code on http://localhost:3000
            window.location.href = `https://gslab-instance-dev.onelogin.com/oidc/2/auth?client_id=c280b4c0-b48c-0139-b237-028559619631125300&redirect_uri=http://localhost:3000&response_type=code&scope=openid profile&code_challenge_method=S256&code_challenge=${code_challenge}&nonce=121212`;
        }

        if (urlParams.get("code")) {
            fetchAccessToken(urlParams.get("code"));
        }
    }, []);

    if (loading) {
        return <div>Loading ....</div>;
    }

    return (
        <Routes>
            {!isAuthenticated ? (
                <>
                    <Route path="/" element={<LoginPage />} />
                </>
            ) : (
                <Route path="/" element={<HomePage userData={userInfo} />} />
            )}
        </Routes>
    );
}

export default App;