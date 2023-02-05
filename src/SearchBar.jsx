import React from "react";
import broom from "./icon/clean.svg";

export default function SearchBar({ setSearchTerm, clearSearchFilter, searchTerm }) {
  const handleChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  return (
    <div className="searchBar-container">
      <div>
        <input
          placeholder="Поиск по имени или e-mail"
          value={searchTerm}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <button onClick={() => clearSearchFilter()}>
        <img src={broom} alt="" />
        Очистить фильтр
      </button>
    </div>
  );
}