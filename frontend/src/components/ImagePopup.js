import './ImagePopup.css';

function ImagePopup(selectedCard) {
    let opened = ''
    if(selectedCard.card.link){
        opened = 'popup_opened'
    } 
    
    return (
        <div className={`popup popup_image ${opened}`}>
            <div className="popup__image-container">
                <img className="popup__image" src={selectedCard.card.link} alt="placeholder" />
                <button className="popup__close" type="button" onClick={selectedCard.onClose}></button>
                <h2 className="popup__image-title">{selectedCard.card.name}</h2>
            </div>
        </div>
    )
}

export default ImagePopup