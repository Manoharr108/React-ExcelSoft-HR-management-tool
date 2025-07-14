import { useState, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Alert from "./Alert";

const AdminButton = () => {
  const [quarters, setQuarters] = useState([]);
  const [activeQuarter, setActiveQuarter] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newQuarter, setNewQuarter] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, SetLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  useEffect(() => {
    const fetching = async () => {
      try {
        SetLoading(true);
        const response = await fetch(
          `http://localhost:9000/achievers-employees`
        );
        const data = await response.json();

        let uniqueQuarters = [...new Set(data.emp.map((emp) => emp.quarter))];
        uniqueQuarters.sort((a, b) => {
          const [yearA, quarterA] = a.split("Q");
          const [yearB, quarterB] = b.split("Q");
          return yearB - yearA || quarterB - quarterA;
        });

        setQuarters(uniqueQuarters);

        const filteredEmployees = data.emp.filter(
          (emp) => emp.quarter === activeQuarter
        );
        const uniqueCategories = [
          ...new Set(filteredEmployees.map((employee) => employee.category)),
        ];
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        } else {
          setActiveCategory("");
        }

        if (uniqueQuarters.length > 0 && !activeQuarter) {
          setActiveQuarter(uniqueQuarters[0]);
        }

        SetLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetching();
  }, [activeQuarter]);

  const handleAddNewQuarter = async (e) => {
    e.preventDefault();

    if (!newQuarter) {
      setAlert({
        visible: true,
        message: "Quarter cannot be empty.",
        type: "danger",
      });
      return;
    }

    if (quarters.includes(newQuarter)) {
      setAlert({
        visible: true,
        message: "Quarter already exists.",
        type: "danger",
      });
      return;
    }

    try {
      SetLoading(true);
      setQuarters([newQuarter, ...quarters]);
      setActiveQuarter(newQuarter);
      setNewQuarter("");

      setAlert({
        visible: true,
        message: "New quarter added!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding new quarter:", error);
      setAlert({
        visible: true,
        message: "Failed to add new quarter.",
        type: "danger",
      });
    } finally {
      SetLoading(false);
    }
  };

  const handleSelectQuarter = (quarter) => {
    setActiveQuarter(quarter);
  };

  return (
    <>
      {alert.visible && (
        <Alert
          text={alert.message}
          type={alert.type}
          onDismiss={() => setAlert({ visible: false, message: "", type: "" })}
        />
      )}

      {loading && <Loader />}

      <Header
        categories={categories}
        setCategories={setCategories}
        activeCategory={activeCategory}
        activeQuarter={activeQuarter}
        SetLoading={SetLoading}
        quarters={quarters}
        handleSelectQuarter={handleSelectQuarter}
        handleAddNewQuarter={handleAddNewQuarter}
        newQuarter={newQuarter}
        setNewQuarter={setNewQuarter}
      />
    </>
  );
};

export default AdminButton;
