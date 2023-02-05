import React from "react";

export default function Pagination({ userPerPage, totalUsers, changePage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / userPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <ul className="pagination">
        {pageNumbers.map((number) => {
          return (
            <li
              className="page-link"
              key={number}
              onClick={() => changePage(number)}
            >
              {number}
            </li>
          );
        })}
      </ul>
    </div>
  );
}