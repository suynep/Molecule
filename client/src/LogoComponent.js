import React from "react";

require('./logo.png');

const LogoComponent = () => {
    return (
        <div>
            <a href="/"><img src={require("./logo.png")} width={50} className="logo-img-wrapper"></img></a>
        </div>
    );
}

export default LogoComponent;