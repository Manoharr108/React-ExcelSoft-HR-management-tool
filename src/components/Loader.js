import React from 'react'
import loadingGif from "../assets/loading.gif"
const Loader = () => {
  return (
   <>
   <div className="loadercontainer" style={{display:'flex', justifyContent:"center", alignItems:"center", margin:"24px"}}>
   <img src={loadingGif} alt="loading gif" />
   </div>
   </>
  )
}

export default Loader
