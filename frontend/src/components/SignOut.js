import { Link } from 'react-router-dom';
import './SignOut.css'

function SignOut(props) {
    let shown = ''
    if(props.isLogOutPopupOpen){
        shown = 'signout_shown'
    }

    return (
        <div className={`signout ${shown}`}>
            <p className="signout__email">{props.userEmail}</p>
            <Link onClick={props.handleLogOutClick} className="signout__button" to="/sign-in">Выйти</Link>
        </div>
    )
}

export default SignOut