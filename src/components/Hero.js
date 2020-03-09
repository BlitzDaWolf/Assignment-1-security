import React from "react";
import Profile from "./profile";
import ExternalApi from "./ExternalApi";

import logo from "../assets/logo.svg";

const Hero = () => {

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
