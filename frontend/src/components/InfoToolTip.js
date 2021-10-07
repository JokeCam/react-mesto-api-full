import './InfoToolTip.css'
import logoSuccess from '../images/Union.svg'
import logoFail from '../images/Union-fail.svg'
import { useHistory } from 'react-router-dom'

function InfoToolTip(props) {
    let opened = ''
    if (props.isLogOutPopupOpen) {
        opened = 'info_opened'
    }

    let history = useHistory();

    function handleCloseClick() {
        let pushLoc = ''
        if (props.popupError){
            pushLoc = '/sign-up'
        } else {
            pushLoc = '/sign-in'
        }
        props.closeAllPopups();
        history.push(pushLoc)
    }

    return (
        <div className={`info ${opened}`}>
            <div className="info__container">
                <img className="info__logo" src={props.popupError ? logoFail : logoSuccess} alt="Иконка 'успешная регистрация' или 'неудачная регистрация'"></img>
                <p className="info__text">{props.popupError ? props.textFail : props.textSuccess}</p>
                <button className="info__close" type="button" onClick={handleCloseClick}></button>
            </div>
        </div>
    )
}

export default InfoToolTip