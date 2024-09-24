import React, { useState, useEffect } from 'react';
import Header from './Header';
const AdminButton = () => {
  const [categories, setCategories] = useState([]);
  let [newCategory, setNewCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await fetch('http://localhost:9000/employees');
        const data = await response.json();
        const uniqueCategories = [...new Set(data.emp.map((employee) => employee.category))];
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0 && !activeCategory) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) { 
        console.error('Error fetching employees:', error);
      }
    };
    fetching();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    let proceed = true
    categories.map((i)=>{
      if(i===newCategory){
        document.getElementById("category-name").value = '';
        alert("This category already exits!!")
        proceed = false
      }
    })
    try {
      if(newCategory && proceed){
        const response = await fetch('http://localhost:9000/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: newCategory }),
        }
      );
      if (response.ok) {
        setCategories([...categories, newCategory]); 
        setActiveCategory(newCategory); 
        setNewCategory = ""; 
      } else {
        console.log('Something went wrong');
      }
    }
    } 
    catch (error) {
      console.log('There is an error', error.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-warning"
        style={{ marginTop: '10px' }}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add Tab ➕
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add new category
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="catadd" onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label htmlFor="category-name" className="col-form-label" required>
                    Category:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-name"
                    placeholder="Enter New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <div className="modal-footer" style={{ height: '3rem' }}>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Header categories={categories} setCategories={setCategories} activeCategory={activeCategory}
      ></Header>
   
    </>
  );
};

export default AdminButton;