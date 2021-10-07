import logo from '../images/logo.svg';
import './Header.css';

function Header(props) {

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Лого сайта: Место" />
      {props.children}
    </header>
  )
}

export default Header;