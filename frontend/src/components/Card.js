import './Card.css'
import { useContext } from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(item) {
    const currentUser = useContext(CurrentUserContext);

    const isOwn = item.item.owner === currentUser._id;

    const isLiked = item.item.likes.some(i => i === currentUser._id);

    function handleDeleteClick(){
        item.onCardDelete(item.item)
    }

    function handleLikeClick() {
        item.onCardLike(item.item)
    }

    function handleClick() {
        item.props(item.item);
    }

    return (
        <article className="element">
            <button className={`${ isOwn ? "element__delete" : "element__delete_hidden"}`} type="button" onClick={handleDeleteClick}></button>
            <img className="element__image" src={item.item.link} alt={item.item.name} onClick={handleClick}/>
            <h2 className="element__title">{item.item.name}</h2>
            <div className="element__like_container">
                <button className={`element__button ${ isLiked ? "element__button_active" : ''}`} type="button" onClick={handleLikeClick}></button>
                <p className="element__likes">{item.item.likes.length}</p>
            </div>
        </article>
    )
}

export default Card