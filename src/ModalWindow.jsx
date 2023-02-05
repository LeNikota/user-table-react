import React from "react";

export default function ModalWindow({ handleDelete, setModalActive, modalActive }) {
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