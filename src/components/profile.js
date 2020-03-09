import React from "react";
import { useAuth0 } from "../react-auth0-spa";

import {
    Button
  } from "reactstrap";

const Profile = () => {
    const { loading, user, loginWithPopup, logout } = useAuth0();

    const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

    if(loading || !user){
        return (<div><Button onClick={() => loginWithPopup({})}>Login</Button></div>);
    }

    return (
        <div>
            <h2>Welcome {user.nickname}</h2>
            <Button onClick={() => {logoutWithRedirect()}}>Logout</Button>
        </div>
    );
}

export default Profile;