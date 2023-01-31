import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './style.css'
import broom from './icon/clean.svg'
import cancel from './icon/cancel.svg'

function SearchBar(){
  const [inputValue, setInputValue] = useState('');
  const clearInput = () =>{
    setInputValue('')
}
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
}
  return (
    <div className="searchBar-container">
      <div>
        <input placeholder="Поиск по имени или e-mail" value={inputValue} onChange={handleInputChange}/>
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

function UserDisplay(){
  return (
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
          <Users/>
        </tbody>
      </table>
    </div>
  )
}

function Users(){
  const [userArr, setUserArr] = useState([]);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users")
  xhr.send()
  xhr.responseType = 'json'
  xhr.onload = function() {
    let arr = xhr.response.map(e => {
      return (
        <tr key={e.id}>
          <td>{e.username}</td>
          <td>{e.email}</td>
          <td>{e.registration_date}</td>
          <td>{e.rating}</td>
          <td><img src={cancel} alt="" width="18px"/></td>
        </tr>
      )
    })
    setUserArr(arr);
  }
  return userArr;
}


function UserTable(){
  return(
    <>
      <SearchBar/>
      <SortingOptions/>
      <UserDisplay/>
    </>
  )
}



const root = ReactDOM.createRoot( document.getElementById('root'));
root.render(<UserTable/>);