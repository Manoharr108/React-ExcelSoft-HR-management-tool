import React from 'react'

const DeleteTab = (props) => {

    function handledeletebtn(){
        try{
            fetch(`http://localhost:9000/tab/${props.value}`,{
                method:"DELETE",
            })
            .then((response)=>{
                let updatedCategories;
                if(response.ok){
                    updatedCategories = props.categories.filter(category => category !== props.value);
                    props.setCategories(updatedCategories);
                }
                if (updatedCategories.length > 0) {
                    const lastButOneTab = updatedCategories[updatedCategories.length - 1];
                    props.setActivetab(lastButOneTab);  
                  }
            })
        }
        catch(err){
            console.log(err.message)
        }
        // window.location.reload()
    }
  return (
    <>
    <button className='btn btn-warning' type='button'
    style={{
      float:"right",
       width:"9rem",
      height:"2.5rem",
      textAlign:"center"
    }} value={props.value}
   
     data-bs-toggle="modal" data-bs-target="#staticBackdrop"
    >Delete Tab ❌</button>


    {/* modal view */}
    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete Tab</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
       Are you sure! <br></br>
         All the Employees in this Tab and the entire Tab itself is <b>Deleted.!
            </b> 
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary"  onClick={handledeletebtn}
        data-bs-dismiss="modal">Understood</button>
      </div>
    </div>
  </div>
</div>
   </>
  )
}

export default DeleteTab;