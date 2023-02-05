import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import "./style.css";
import broom from "./icon/clean.svg";
import cancel from "./icon/cancel.svg";

function SearchBar({setSearch}) {
  const [inputValue, setInputValue] = useState("");
  const clearInput = () => {
    setInputValue("");
  };
  const handleChange = (e) => {
    //setInputValue(e.target.value);
    setSearch(/*inputValue*/e.target.value.toLowerCase())
  };
  return (
    <div className="searchBar-container">
      <div>
        <input
          placeholder="Поиск по имени или e-mail"
          //value={inputValue}
          onChange={() => handleChange}
        />
      </div>
      <button onClick={() => clearInput}>
        <img src={broom} alt="" />
        Очистить фильтр
      </button>
    </div>
  );
}

function SortingOptions({setSorting, sortingToggle, setSortingToggle}) {
  const handleClick = (value) => {
    setSorting(value)
    setSortingToggle(sortingToggle === "asc" ? "desc" : "asc");
  }
  return (
    <div className="sorting">
      <span>Сортировка:</span>
      <input id="registration-date" name="sort" type="radio"/>
      <label for="registration-date" onClick={() => handleClick("registrationDate")}>Дата регистрации</label>
      <input id="rating" name="sort" type="radio"/>
      <label for="rating" onClick={() => handleClick("rating")}>Рейтинг</label>
    </div>
  );
}

function ModalWindow({handleDelete, setModalActive, modalActive}) {
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
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState(null)
  const [sortingToggle, setSortingToggle] = useState(null)
  const userPerPage = 5;
  let userIdRef = useRef(null);

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

  function handleClick(id) {
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

  const lastUserIndex = currentPage * userPerPage;
  const firstUserIndex = lastUserIndex - userPerPage;
  const currentUsers = userArr.slice(firstUserIndex, lastUserIndex);//
  console.log('update')//

  console.log(sortingToggle,444)//
  return (
    <>
      <SearchBar setSearch={(value) => setSearch(value)}/>
      <SortingOptions setSorting={(value) => setSorting(value)} sortingToggle={sortingToggle} setSortingToggle={(value) => setSortingToggle(value)}/>
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
            {
              userArr
              .filter((e) => {
                if(e.username.toLowerCase().includes(search)){
                  return e;
                }
                if(e.email.toLowerCase().includes(search)){
                  return e;
                }
                return e;
              })
              .sort((a, b) => {
                if(sorting === "rating"){
                  return sortingToggle === "asc"
                    ? (a.rating > b.rating ? 1 : -1)
                    : (a.rating < b.rating ? 1 : -1)
                } else if(sorting === "registrationDate") {
                  return Date.parse(a.registration_date) > Date.parse(b.registration_date) ? 1 : -1;
                }
                return 0;
              })
              .map((e) => {
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
                        onClick={() => handleClick(e.id)}
                      />
                    </td>
                  </tr>
                );
              })
              .slice(firstUserIndex, lastUserIndex)
            }
          </tbody>
        </table>
      </div>
      <ModalWindow
        handleDelete={handleDelete}
        modalActive={modalActive}
        setModalActive={setModalActive}
      />
      <Pagination
        userPerPage={userPerPage}
        totalUsers={userArr.length}
        changePage={changePage}
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
