import React from 'react';

const CardItem = (props) => {
  return (
    <>
      <div className="card" style={{ width: "15rem", marginBottom: "1rem" }}>
        <img src={props.image} className="card-img-top" alt="Card image" />
        <div className="card-body">
          <h5 className="card-title">{props.name}</h5>
          <h6 className="card-title">{props.role}</h6>
          {/* <p className="card-text">{props.achievement}</p> */}
        </div>
        <button className='btn btn-primary'>Edit</button>
        <button className='btn btn-primary'>Delete</button>
      </div>
    </>
  );
};

export default CardItem;
