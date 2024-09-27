import React from 'react'
import loadingGif from "../assets/loading.gif"
const Loader = () => {
  return (
   <>
   <div className="loadercontainer" style={{position: 'fixed',left:"48%", top:"33%", zIndex:12}}>
   <img src={loadingGif} alt="loading gif" />
   </div>
   </>
  )
}

export default Loader
