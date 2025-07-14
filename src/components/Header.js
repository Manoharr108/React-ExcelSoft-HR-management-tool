import { useState, useEffect } from "react";
import Card from "./Card";
import { useAuth } from "../context/Authcontext";
import HeaderLayout from "./HeaderLayout";
import DeleteTab from "./DeleteTab";

function Header({
  categories,
  setCategories,
  activeCategory,
  activeQuarter,
  SetLoading,
  quarters,
  handleSelectQuarter,
  handleAddNewQuarter,
  newQuarter,
  setNewQuarter
}) {
  const [activetab, setActivetab] = useState(activeCategory || categories[0]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [publishstatus, Setpublishstatus] = useState(false);
  const { isAdmin, canPublish } = useAuth();

  async function refreshPublishStatus() {
    try {
      let res = await fetch(`http://localhost:9000/achievers-employees`);
      let data = await res.json();
      const filtered = data.emp.filter((emp) => emp.quarter === activeQuarter);
      const isAllPublished = filtered.every((emp) => emp.epublic === true);
      Setpublishstatus(isAllPublished);
    } catch (err) {
      console.error("Error refreshing publish status", err);
    }
  }

  async function countfunction(category) {
    let data = await fetch(
      `http://localhost:9000/tab/${category}/${activeQuarter}`
    );
    let response = await data.json();
    return response.length ;
  }

  async function refreshCategoryCount(category) {
    let count = await countfunction(category);
    setCategoryCounts((prevcount) => ({
      ...prevcount,
      [category]: count,
    }));
  }

  useEffect(() => {
    async function fetchCounts() {
      const counts = {};
      for (let category of categories) {
        const count = await countfunction(category);
        counts[category] = count;
      }
      setCategoryCounts(counts);
      refreshPublishStatus();
    }
    fetchCounts();
    setActivetab(activeCategory);
  }, [activeCategory, categories]);

  return (
    <>
      <HeaderLayout
        activeQuarter={activeQuarter}
        handleSelectQuarter={handleSelectQuarter}
        categories={categories}
        activeTab={activetab}
        setActiveTab={setActivetab}
        categoryCounts={categoryCounts}
        SetLoading={SetLoading}
        quarters={quarters}
        accessLabel={isAdmin ? "Admin" : canPublish ? "HR" : "Viewer"}
        publishstatus={publishstatus}
        handleAddNewQuarter={handleAddNewQuarter}
        setNewQuarter={setNewQuarter}
        newQuarter={newQuarter}
      />

      <Card
        currcat={activetab}
        activeQuarter={activeQuarter}
        SetLoading={SetLoading}
        refreshCategoryCount={refreshCategoryCount}
        refreshPublishStatus={refreshPublishStatus}
        DeleteTabComponent={
          <DeleteTab
            value={activetab}
            categories={categories}
            setCategories={setCategories}
            setActivetab={setActivetab}
            activeCategory={activetab}
            activeQuarter={activeQuarter}
          />
        }
      />
    </>
  );
}

export default Header;