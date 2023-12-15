import '@babel/polyfill';
import { login } from './login';
import { signup } from './signup';
//VALUES
const loginForm = document.querySelector('.form');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Change button text while Signing up a new user
    document.querySelector('.btn--signup').innerText = 'Signing...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordconfirm').value;
    await signup(name, email, password, passwordConfirm);

    // Change button text and clear input-fields after Signing up new user
    document.querySelector('.btn--signup').innerText = 'Signup';
    signupForm.reset();
  });
}

// LOGIN USING AXION(API) //////////////////////////////////////////////////////////////////////////////////////
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Change button text while login
    document.querySelector('.btn--login').innerText = 'Logging...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    console.log(email, password);
    // Change button text after login
    document.querySelector('.btn--login').innerText = 'Login';
  });
}
