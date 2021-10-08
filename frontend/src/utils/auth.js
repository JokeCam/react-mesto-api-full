const BASE_URL = 'https://api.mesto.stanislav.nomoredomains.club'

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "password": password,
      "email": email
    })
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else 
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }
    )
}

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "password": password,
      "email": email
    })
  })
    .then((res) => {
      console.log(res)
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }
    )
}

export const logout = () => {
  return fetch(`${BASE_URL}/signout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((res) => {
      console.log(res)
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }
    )
}