import React, { useState, useEffect } from 'react';
import Tab from './Tab';
import Card from './Card';
import DeleteTab from './DeleteTab';

function Header({ categories, setCategories, activeCategory , activeQuarter, SetLoading}) {
  const [activetab, setActivetab] = useState(activeCategory || categories[0]);

  const [categoryCounts, setCategoryCounts] = useState({});

  const handleTabClick = (category) => {
    setActivetab(category);
  };
  
//coutns the no of employees
  async function countfunction(category) {
    let data = await fetch(`http://localhost:9000/tab/${category}/${activeQuarter}`);
    let response = await data.json();
    return response.length - 1;
  }

  useEffect(() => {
    setActivetab(activeCategory); 
  }, [activeCategory]);

  async function refreshCategoryCount(category){
    let count = await countfunction(category);
    setCategoryCounts(prevcount=>({
      ...prevcount, 
      [category]:count
    }))
  } 

  // Fetch the counts for each category and store in state
    useEffect(() => {
    async function fetchCounts() {
      const counts = {};
      for (let category of categories) {
        const count = await countfunction(category);
        counts[category] = count;
      }
      setCategoryCounts(counts);
    }

    fetchCounts();
  }, [categories]);

  return (
    <>
      <h1 className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        Employee Achievements - {activeQuarter}
      </h1>
      
      <div className="tabcontainer" style={{display:"flex",margin:"25px"}}>
        <ul className="nav nav-tabs">
          {categories.map((category, index) => (
            <Tab
              key={index}
              name={category}
              count={categoryCounts[category] || 0} 
              onClick={() => handleTabClick(category)}
              isActive={category === activetab}
            />
          ))}
        </ul>
        <DeleteTab 
          value={activetab} 
          categories={categories}
          setCategories={setCategories} 
          setActivetab={setActivetab}
          activeCategory = {activetab}
          activeQuarter = {activeQuarter}
        />
      </div>
     

      <Card currcat={activetab} activeQuarter={activeQuarter} SetLoading={SetLoading} refreshCategoryCount={refreshCategoryCount}></Card>
    </>
  );
}

export default Header;