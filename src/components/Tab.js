import React from 'react';

const Tab = (props) => {
  return (
    <li
      className="nav-item"
      style={{ cursor: "pointer" }}
      onClick={props.onClick}
    >
      <a className={`nav-link ${props.isActive ? 'active' : ''}`} aria-current="page">
        {props.name}
      <span className={`position-absolute top-1 start-5 translate-middle badge rounded-pill bg-${props.count>0?"primary":"danger"}`} style={{top:"122px"}}>
          {`${props.count}`}
        </span>
      </a>
    </li>
  );
}

export default Tab;
