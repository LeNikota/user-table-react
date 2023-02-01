import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useRef } from 'react';
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

function UserDisplay(props){
  const [userArr, setUserArr] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  let userIdRef = useRef(null);
  if(!props.renderedOnce){
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
      props.setRenderedOnce(true);
    }
  }

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
          {userArr}
        </tbody>
      </table>
      <ModalWindow handleDelete={handleDelete} modalActive={modalActive} setModalActive={setModalActive}/>
    </div>
  )
}

class UserTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      renderedOnce:false
    }
  }

  render(){
    return(
      <>
        <SearchBar/>
        <SortingOptions/>
        <UserDisplay renderedOnce={this.state.renderedOnce} setRenderedOnce={(value) => this.setState({renderedOnce: value})}/>
      </>
    )
  }
}



const root = ReactDOM.createRoot( document.getElementById('root'));
root.render(<UserTable/>);