import React, { useState, useEffect } from 'react';
import Tab from './Tab';
import Card from './Card';
// import EmpAddButton from './EmpAddButton'
import DeleteTab from './DeleteTab';
// import Dropdown from './Dropdown';

function Header({ categories, setCategories, activeCategory , activeQuarter}) {
  const [activetab, setActivetab] = useState(activeCategory || (categories[0]));
  const handleTabClick = (category) => {
    setActivetab(category);
  };

  useEffect(() => {
    setActivetab(activeCategory); 
  }, [activeCategory]);

  return (
    <>
      <h1 className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        Employee Achievements - {activeQuarter}
      </h1>
      <div className="tabcontainer" style={{display:"flex",gap:"4px"}}>

          <ul className="nav nav-tabs">
                {categories.map((category, index) => (
                  <Tab
                  key={index}
                  name={category}
                  onClick={() => handleTabClick(category)}
                  isActive={category === activetab}
                  />
                ))}
          </ul>

              <DeleteTab value={activetab} categories={categories}
              setCategories = {setCategories} setActivetab={setActivetab}
              ></DeleteTab>

              {/* <Dropdown></Dropdown> */}
        </div>
      <Card currcat={activetab} activeQuarter={activeQuarter}></Card>
      {/* <EmpAddButton curract = {activetab} setActivetab={setActivetab} ></EmpAddButton> */}
    </>
  );
}

export default Header;