import { useRef } from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup(props) {

    const avatarInput = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        
        props.onUpdateAvatar(avatarInput.current.value,);
    };

    return (
        <PopupWithForm title={'Обновить аватар'} name={'edit-avatar'} children={
            <>
                <input ref={avatarInput} className="popup__input" type="url" id="avatar__name_input" name="avatar" placeholder="Ссылка на картинку" required />
                <span className="popup__input-error" id="avatar__name_input_error"></span>
            </>
        } isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} />
    )
}

export default EditAvatarPopup