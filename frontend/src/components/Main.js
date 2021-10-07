import './Main.css'
import { useContext } from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {

  const currentUser = useContext(CurrentUserContext);

  const onAddPlace = () => {
    props.onAddPlace()
  }

  const onEditProfile = () => {
    props.onEditProfile()
  }

  const onEditAvatar = () => {
    props.onEditAvatar()
  }
  
  return (
    <main className="main">
      <section className="profile">
        <div className="profile__container">
          <button type="button" className="profile__edit-button" onClick={onEditAvatar}></button>
          <img className="profile__picture" src={currentUser.avatar} alt="Аватар пользователя" />
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button aria-label="кнопка редактировать" className="profile__button" type="button" onClick={onEditProfile}></button>
          <div className="profile__brake"></div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
      </section>
      <section className="elements">
        {
          props.cards.map((item) => (
            <Card key={item._id} item={item} props={props.onCardClick} onCardLike={props.handleCardLike} onCardDelete={props.handleCardDelete} />
            )
          )
        }
      </section>
    </main>
  )
}

export default Main