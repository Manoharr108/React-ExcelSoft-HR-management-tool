import React, { useState, useEffect } from 'react';
import Tab from './Tab';
import Card from './Card';
import EmpAddButton from './EmpAddButton'
import DeleteTab from './DeleteTab';

function Header({ categories, setCategories, activeCategory }) {
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
        Employee Achievements
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
        </div>
      <Card currcat={activetab}></Card>
      <EmpAddButton curract = {activetab}></EmpAddButton>
    </>
  );
}

export default Header;