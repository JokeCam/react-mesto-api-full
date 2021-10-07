import './Register.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header.js'



function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault()
        props.handleRegister(email, password)
    }

    return (
        <>
            <Header>
                <Link className="header__link" to="/sign-in">Войти</Link>
            </Header>
            <form onSubmit={handleSubmit} className="register register__form">
                <h1 className="register__title">Зарегистрироваться</h1>
                <input onChange={handleEmailChange} value={email} className="register__input" type="email" placeholder="Email" required></input>
                <input onChange={handlePasswordChange} value={password} className="register__input" type="password" placeholder="Пароль" required></input>
                <button className="register__button" type="submit">Зарегистрироваться</button>
                <Link className="register__text" to="/sign-in">Уже зарегистрированы? Войти</Link>
            </form>
        </>
    )
}

export default Register