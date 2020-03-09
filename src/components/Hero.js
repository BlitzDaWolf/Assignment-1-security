import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import Profile from "./profile";
import ExternalApi from "./ExternalApi";

import logo from "../assets/logo.svg";
import Loading from "../components/Loading";

const Hero = () => {
  const { loading, user } = useAuth0();

  console.log({user, loading});

  if(loading){
    return(<Loading/>);
  }

  return(
    <div>
      <div className="text-center mb-5">
        <Profile />
        <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
        <h1 className="mb-4">React singel page application with Auth0 auth</h1>
      </div>
      <ExternalApi />
    </div>
  );
}

export default Hero;
