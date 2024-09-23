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
      </a>
    </li>
  );
}

export default Tab;
