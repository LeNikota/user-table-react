import React from "react";

export default function SortingOptions({ setSortingMode, sortingToggle, setSortingToggle }) {
  const handleClick = (value) => {
    setSortingMode(value);
    setSortingToggle(sortingToggle === "asc" ? "desc" : "asc");
  };
  return (
    <div className="sorting">
      <span>Сортировка:</span>
      <input id="registration-date" name="sort" type="radio" />
      <label
        for="registration-date"
        onClick={() => handleClick("registrationDate")}
      >
        Дата регистрации
      </label>
      <input id="rating" name="sort" type="radio" />
      <label for="rating" onClick={() => handleClick("rating")}>
        Рейтинг
      </label>
    </div>
  );
}