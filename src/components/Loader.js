import React from 'react'
import loadingGif from "../assets/loading.gif"
const Loader = () => {
  return (
   <>
   <div className="loadercontainer" style={{
    position:"fixed",
    width:"100%",
    zIndex:1,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    height:"100vh"
     }}>
   <img src={loadingGif} alt="loading gif" style={{
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width:"100px"
   }} />
   {/* <img src="https://i.pinimg.com/originals/3e/80/39/3e8039242e517ee7edc05a4e226e0b80.gif" alt="loading gif"
   style={{
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width:"100px"
   }}
    /> */}
   </div>
   </>
  )
}

export default Loader