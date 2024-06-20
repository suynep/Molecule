import React from "react";
import { Link } from 'react-router-dom';

require('./logo.png');

const LogoComponent = (props) => {
    let refString = `/editor/${props.roomId}`;
    return (
        <div>
            {/* <a href={refString}><img src={require("./logo.png")} width={50} className="logo-img-wrapper"></img></a> */}
            <Link to={refString} state={{roomId: props.roomId, username: props.username}} className="logo-text"> <img src={require("./logo.png")} width={50} className="logo-img-wrapper"></img></Link>
        </div>
    );
}

export default LogoComponent;