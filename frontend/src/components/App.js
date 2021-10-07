import { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory, Link } from 'react-router-dom';

import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { login } from '../utils/auth.js'
import { logout } from '../utils/auth.js'
import { register } from '../utils/auth.js'

import Login from './Login.js';
import Register from './Register.js';
import InfoToolTip from './InfoToolTip.js';
import SignOut from './SignOut.js';
import ProtectedRoute from './ProtectedRoute.js';

import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function App() {
  let history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false)

  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isLogOutPopupOpen, setIsLogOutPopupOpen] = useState(false)

  const [selectedCard, setSelectedCard] = useState({})

  const [userEmail, setUserEmail] = useState('')

  const [popupError, setPopupError] = useState(false)

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);

    if (!isLiked) {
      api.addLike(card._id)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch(err => console.log(`Что-то пошло не так: ${err}`));
    } else {
      api.removeLike(card._id)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch(err => console.log(`Что-то пошло не так: ${err}`));
    }
  }

  function handleCardDelete(card) {
    console.log(card)
    api.deleteCard(card._id)
      .then(setCards(cards.filter(item => item._id !== card._id)))
      .catch(err => console.log(`Что-то пошло не так: ${err}`));
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups()
      })
      .catch(err => console.log(`Что-то пошло не так: ${err}`));
  }

  function updateUserInfo() {
    api.getUserInfo()
    .then((res) => {
      if (res) {
        setCurrentUser(res)
        setUserEmail(res.email)
        setLoggedIn(true)
        history.push('/content')
      }
    })
    .catch(err => console.log(`Что-то пошло не так: ${err}`))
  }

  function updateCards() {
    api.getCards()
    .then(res => setCards(res))
    .catch(err => console.log(`Что-то пошло не так: ${err}`))
  }

  function cookieCheck() {
    updateUserInfo();
    updateCards();
  }

  function handleLogOutClick() {
    logout();
  }

  function handleHeaderButtonClick() {
    if (!isLogOutPopupOpen) {
      setIsLogOutPopupOpen(true)
    } else {
      setIsLogOutPopupOpen(false)
    }
  }

  function handleLogin(email, password) {
    login(email, password)
      .then((res) => {
        if (res) {
          setUserEmail(email)
          setCurrentUser(res)
          console.log(res)
          setLoggedIn(true)
          history.push('/content')
        }
      })
  }

  function handleRegister(email, password) {
    register(email, password)
      .then((res) => {
        if (res) {
          console.log(res)
          setPopupError(false)
          setLoggedIn(true)
          setIsLogOutPopupOpen(true)
        }
      })
      .catch((err) => {
        console.log(err)
        if (err) {
          console.log(err)
          setPopupError(true)
          setIsLogOutPopupOpen(true)
        }
        else {
          setPopupError(false)
        }
      })
  }

  // useEffect(() => {
  //   api.getCards()
  //     .then(res => setCards(res))
  //     .catch(err => console.log(`Что-то пошло не так: ${err}`))
  // }, [])

  // useEffect(() => {
  //   api.getUserInfo()
  //     .then((res) => {
  //       setCurrentUser(res);
  //     })
  //     .catch(err => console.log(`Что-то пошло не так: ${err}`))
  // }, [])

  useEffect(() => {
    cookieCheck()
  }, [])

  const handleUpdateUser = (data) => {
    api.updateUserInfo(data)
      .then(res => {
        console.log(res)
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(`Что-то пошло не так: ${err}`));
  }

  const handleUpdateAvatar = (data) => {
    api.updateUserAvatar(data)
      .then(res => {
        setCurrentUser(res)
        closeAllPopups();
      })
      .catch(err => console.log(`Что-то пошло не так: ${err}`))
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  const handleCardClick = (url) => {
    setSelectedCard(url)
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsLogOutPopupOpen(false)
    setSelectedCard({})
  }

  return (
    <div className="content">
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path="/content">
            <SignOut userEmail={userEmail} isLogOutPopupOpen={isLogOutPopupOpen} handleLogOutClick={handleLogOutClick} />
            <Header>
              <div className="header__container">
                <p className="header__email">{userEmail}</p>
                <Link onClick={handleLogOutClick} className="header__signout" to="/sign-in">Выйти</Link>
              </div>
              <button onClick={handleHeaderButtonClick} className={`header__button ${!isLogOutPopupOpen ? '' : 'header__button_active'}`} type="button"></button>
            </Header>
            <ProtectedRoute exact path="/"
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              handleCardLike={handleCardLike}
              handleCardDelete={handleCardDelete}
              cards={cards}
              loggedIn={loggedIn}
            />
            <Footer />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
            <PopupWithForm title={'Вы уверены?'} name={'confirm'} children={
              <>
              </>
            } />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
            <InfoToolTip isLogOutPopupOpen={isLogOutPopupOpen} closeAllPopups={closeAllPopups} popupError={popupError} textSuccess={'Вы успешно зарегистрировались'} textFail={'Что-то пошло не так! Попробуйте еще раз.'} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/content" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
