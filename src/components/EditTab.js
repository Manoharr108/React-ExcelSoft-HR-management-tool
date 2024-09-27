import React from 'react'

const EditTab = ({activeCategory}) => {
    function updatename(){
        document.getElementById("tab-name").value = activeCategory
    }
    return (
        <>
        <button className='btn btn-warning' style={{
            float:"right",
           width:"9rem",
           height:"2.5rem",
           textAlign:"center",
           marginLeft:"auto"
        }}
        data-bs-toggle="modal"
        data-bs-target="#modalforedittab"
        onClick={updatename}
        >Edit Tab 🔧</button>

            <div className="modal fade" id="modalforedittab" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{`Edit Tab -  "${activeCategory}" Tab`}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                    <div className="mb-3">
                        <label for="tab-name" className="col-form-label">Name</label>
                        <input type="text" 
                        className="form-control" id="tab-name"/>
                    </div>
                    </form>
                       
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-success">Save</button>
                </div>
                </div>
            </div>
            </div>
    </>
  )
}

export default EditTab
