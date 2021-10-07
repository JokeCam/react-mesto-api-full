import { useState, useContext, useEffect } from 'react';

import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup(props) {

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser.name || '');
        setDescription(currentUser.about || '');
    }, [currentUser]);

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    function handleNameInput(e){
        setName(e.target.value)
    }

    function handleDescriptionInput(e){
        setDescription(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
          name: name,
          about: description,
        });
    } 

    return (
        <PopupWithForm title={'Редактировать профиль'} name={'edit'} children={
            <>
                <input className="popup__input" value={name} onChange={handleNameInput} type="text" id="name__input" name="name" placeholder="Ваше имя" required noValidate minLength="2" maxLength="40" />
                <span className="popup__input-error" id="name__input_error"></span>
                <input className="popup__input" value={description} onChange={handleDescriptionInput} type="text" id="job__input" name="about" placeholder="Чем занимаетесь?" required noValidate minLength="2" maxLength="200" />
                <span className="popup__input-error" id="job__input_error"></span>
            </>
        } isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}/>
    )
}

export default EditProfilePopup