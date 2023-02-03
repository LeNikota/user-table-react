import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import './style.css'
import broom from './icon/clean.svg'
import cancel from './icon/cancel.svg'

function SearchBar(){
  const [inputValue, setInputValue] = useState('');
  const clearInput = () =>{
    setInputValue('')
}
  const handleChange = (e) => {
    setInputValue(e.target.value)
}
  return (
    <div className="searchBar-container">
      <div>
        <input placeholder="Поиск по имени или e-mail" value={inputValue} onChange={handleChange}/>
      </div>
      <button onClick={clearInput}>
        <img src={broom} alt=""/>
        Очистить фильтр
      </button>
    </div>
  )
}

function SortingOptions(){
  return (
    <div className="sorting">
      <span>Сортировка:</span>
      <input id="registration-date" name="sort" checked type="radio"/><label for="registration-date">Дата регистрации</label>
      <input id="rating" name="sort" type="radio"/><label for="rating">Рейтинг</label>
    </div>
  )
}

function ModalWindow(props) {
  return (
    <div className={props.modalActive ? 'overlay active' : 'overlay'}>
      <div className='modal-window'>
        <p>Вы уверены, что хотите удалить пользователя?</p>
        <div>
          <button onClick={() => props.handleDelete()}>Да</button>
          <button onClick={() => props.setModalActive(false)}>Нет</button>
        </div>
      </div>
    </div>
  )
}

function Pagination({userPerPage, totalUsers, changePage}) {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalUsers/userPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <ul className="pagination">
        {
          pageNumbers.map(number => {
            return <li className="page-link" key={number} onClick={() => changePage(number)}>{number}</li>
          })
        }
      </ul>
    </div>
  )
}

function UserDisplay(){
  const [userArr, setUserArr] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const userPerPage = 5;
  let userIdRef = useRef(null);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users")
    xhr.send()
    xhr.responseType = 'json'
    xhr.onload = function() {
      const arr = xhr.response.map(e => {
        return (
          <tr key={e.id}>
            <td>{e.username}</td>
            <td>{e.email}</td>
            <td>{convertDate(e.registration_date)}</td>
            <td>{e.rating}</td>
            <td><img src={cancel} className="cancelBtn" alt="" width="18px" onClick={() => handleClick(e.id)}/></td>
          </tr>
        )
      })
      setUserArr(arr);
    }
  }, [])
  
  const convertDate = (value) => {
    function addZero(num) {
      return num.toString().padStart(2, '0');
    }
    const date = new Date(value);
    const month = addZero(date.getUTCMonth() + 1);
    const day = addZero(date.getDay() + 1);
    const year = addZero(date.getUTCFullYear());
    return year + "." + month + "." + day;
  }

  function handleClick(id) {
    setModalActive(true);
    userIdRef.current = id;
  }

  function handleDelete() {
    const arr = userArr.filter(e => e.key !== userIdRef.current)
    setUserArr(arr);
    setModalActive(false);
  }

  function changePage(pageNumber) {
    setCurrentPage(pageNumber)
  }

  const lastUserIndex = currentPage * userPerPage;
  const firstUserIndex = lastUserIndex - userPerPage;
  const currentUsers = userArr.slice(firstUserIndex, lastUserIndex);

  return (
    <>
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
            {currentUsers}
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
  )
}

class UserTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return(
      <>
        <SearchBar/>
        <SortingOptions/>
        <UserDisplay/>
      </>
    )
  }
}



const root = ReactDOM.createRoot( document.getElementById('root'));
root.render(<UserTable/>);