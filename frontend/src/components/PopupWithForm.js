import './PopupWithForm.css';

function PopupWithForm({title, name, children, isOpen, onClose, onSubmit}) {
    let opened = ''
    if(isOpen){
        opened = 'popup_opened'
    } 

    return (
        <div className={`popup popup_${name} ${opened}`}>
            <div className="popup__container">
                <h2 className="popup__title">{title}</h2>
                <form className="popup__form" id={name} name={name} onSubmit={onSubmit}>
                    {children}
                    <button form={name} className="popup__button" type="submit">Сохранить</button>
                </form>
                <button className="popup__close" type="button" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default PopupWithForm