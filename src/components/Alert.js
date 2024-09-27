import React from 'react'

const Alert = (props) => {
  return (
    <>
    <div className="alert alert-primary" role="alert" style={{
        // visibility:props.status,
        position:"fixed",
        zIndex:1,
        right:"85px",
        top:"186px"
        
    }}>
        {props.text}
    </div>
    </>
  )
}

export default Alert
