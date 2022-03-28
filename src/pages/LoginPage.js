import React from "react";

const LoginPage = () => {
    const handleClick = () => {
        window.location.href =
            "https://gslab-instance-dev.onelogin.com/access/initiate?iss=https://accounts.google.com&target_link_uri=http://localhost:3000?check-login=true";
    };

    return (
        <div>
            <button onClick={handleClick}>Signin With google</button>
        </div>
    );
};

export default LoginPage;