import './Login.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header.js'

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function handleEmailChange(e){
        setEmail(e.target.value);
    }

    function handlePasswordChange(e){
        setPassword(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        props.handleLogin(email, password)
    }


    return (
        <>
            <Header>
                <Link className="header__link" to="/sign-up">Регистрация</Link>
            </Header>
            <form onSubmit={handleSubmit} className="login login__form">
                <h1 className="login__title">Вход</h1>
                <input value={email} onChange={handleEmailChange} className="login__input" type="email" placeholder="Email" required></input>
                <input value={password} onChange={handlePasswordChange} className="login__input" type="password" placeholder="Пароль" required></input>
                <button className="login__button" type="submit">Войти</button>
            </form>
        </>
    )
}

export default Login