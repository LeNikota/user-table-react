import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import "./style.css";
import broom from "./icon/clean.svg";
import cancel from "./icon/cancel.svg";

function SearchBar({ setSearchTerm, clearSearchFilter, searchTerm }) {
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

function SortingOptions({ setSortingMode, sortingToggle, setSortingToggle }) {
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

function ModalWindow({ handleDelete, setModalActive, modalActive }) {
  return (
    <div className={modalActive ? "overlay active" : "overlay"}>
      <div className="modal-window">
        <p>Вы уверены, что хотите удалить пользователя?</p>
        <div>
          <button onClick={() => handleDelete()}>Да</button>
          <button onClick={() => setModalActive(false)}>Нет</button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ userPerPage, totalUsers, changePage }) {
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

function UserDisplay() {
  const [userArr, setUserArr] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortingMode, setSortingMode] = useState(null);
  const [sortingToggle, setSortingToggle] = useState(null);
  const userPerPage = 5;
  let userArrLength = 0;
  const userIdRef = useRef(null);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users");
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = function () {
      setUserArr(xhr.response);
    };
  }, []);

  const convertDate = (value) => {
    function addZero(num) {
      return num.toString().padStart(2, "0");
    }
    const date = new Date(value);
    const month = addZero(date.getUTCMonth() + 1);
    const day = addZero(date.getUTCDate() + 1);
    const year = addZero(date.getUTCFullYear());
    return year + "." + month + "." + day;
  };

  function openModalWindow(id) {
    setModalActive(true);
    userIdRef.current = id;
  }

  function handleDelete() {
    const arr = userArr.filter((e) => e.id !== userIdRef.current);
    setUserArr(arr);
    setModalActive(false);
  }

  function changePage(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function clearSearchFilter() {
    setSortingMode(null);
    setSortingToggle(null);
    setSearchTerm("");
  }

  function filterUserArr(arr) {
    return arr.filter((e) => {
      if (
        e.username.toLowerCase().includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm)
      ) {
        return e;
      }
    });
  }

  function sortUserArr(arr) {
    return arr.sort((a, b) => {
      if (sortingMode === "rating") {
        return sortingToggle === "asc"
          ? (a.rating > b.rating ? 1 : -1)
          : (a.rating < b.rating ? 1 : -1)
      } else if (sortingMode === "registrationDate") {
        return sortingToggle === "asc"
          ? (Date.parse(a.registration_date) > Date.parse(b.registration_date) ? 1 : -1)
          : (Date.parse(a.registration_date) < Date.parse(b.registration_date) ? 1 : -1)
      }
      return 0;
    })
  }

  function turnUserArrIntoJSX(arr) {
    return arr.map((e) => {
      return (
        <tr key={e.id}>
          <td>{e.username}</td>
          <td>{e.email}</td>
          <td>{convertDate(e.registration_date)}</td>
          <td>{e.rating}</td>
          <td>
            <img
              src={cancel}
              className="cancelBtn"
              alt=""
              width="18px"
              onClick={() => openModalWindow(e.id)}
            />
          </td>
        </tr>
      );
    });
  }

  function paginateUserArr(arr) {
    userArrLength = arr.length;
    const lastUserIndex = currentPage * userPerPage;
    const firstUserIndex = lastUserIndex - userPerPage;
    const currentUsers = arr.slice(firstUserIndex, lastUserIndex);
    if (userArrLength <= firstUserIndex && userArrLength !== 0 && userArrLength) {
      setCurrentPage(currentPage - 1);
    }
    return currentUsers;
  }

  return (
    <>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => setSearchTerm(value)}
        clearSearchFilter={() => clearSearchFilter()}
      />
      <SortingOptions
        setSortingMode={(value) => setSortingMode(value)}
        setSortingToggle={(value) => setSortingToggle(value)}
        sortingToggle={sortingToggle}
      />
      <div className="user-display">
        <table>
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th>E-mail</th>
              <th>Дата регистрации</th>
              <th>Рейтинг</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginateUserArr(
              turnUserArrIntoJSX(sortUserArr(filterUserArr(userArr)))
            )}
          </tbody>
        </table>
      </div>
      <ModalWindow
        handleDelete={handleDelete}
        setModalActive={setModalActive}
        modalActive={modalActive}
      />
      <Pagination
        changePage={changePage}
        userPerPage={userPerPage}
        totalUsers={userArrLength}
      />
    </>
  );
}

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <UserDisplay />
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UserTable />);
