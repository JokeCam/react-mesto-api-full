import { useState } from 'react'

import PopupWithForm from './PopupWithForm.js'

function AddPlacePopup(props) {

    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    
    function handleNameChange(e){
        setName(e.target.value)
    }

    function handleLinkChange(e){
        setLink(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault();

        props.onAddPlace({
            name: name,
            link: link,
        })

        setName('');
        setLink('');
    }

    return (
        <PopupWithForm title={'Новое место'} name={'add-card'} isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
            <>
                <input className="popup__input" value={name} onChange={handleNameChange} type="text" id="card__name_input" name="name" placeholder="Название" required minLength="2" maxLength="30" />
                <span className="popup__input-error" id="card__name_input_error"></span>
                <input className="popup__input" value={link} onChange={handleLinkChange} type="url" id="img__src_input" name="link" placeholder="Ссылка на картинку" required />
                <span className="popup__input-error" id="img__src_input_error"></span>
            </>
         </PopupWithForm>
    )
}

export default AddPlacePopup