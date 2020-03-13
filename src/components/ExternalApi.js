import React, { useState } from "react";

import { Button } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
    const [apiMessage, setApiMessage] = useState({});
    const { getTokenSilently, user } = useAuth0();

    if(!user) return (<div></div>);

    const callApi = async () => {
        try {
          const token = await getTokenSilently();

          const response = await fetch("/api/external", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          const responseData = await response.json();
    
          setApiMessage(responseData);
        } catch (error) {
          console.error(error);
        }
      };

    const callRole = async () => {
      try{
        const token = await getTokenSilently();

        const response = await fetch("/api/getrole", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const responseData = await response.json();
        setApiMessage(responseData);
      }catch (error){

      }
    }

    return(
        <>
            <div className="text-center mb-5">
                <Button color="primary" className="mt-5" onClick={callApi}>
                Ping API
                </Button>
                <Button color="primary" className="mt-5" onClick={callRole}>
                Ping role
                </Button>
            </div>
            <div className="result-block-container">
                <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
            </div>
        </>
        );
}

export default ExternalApi;