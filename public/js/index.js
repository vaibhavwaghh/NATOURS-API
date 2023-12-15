import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const updateNameEmail = document.querySelector('.form-user-data');
const updatePasswordUser = document.querySelector('.form-user-password');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOut) {
  logOut.addEventListener('click', logout);
}

if (updateNameEmail) {
  updateNameEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    console.log(name, email);
    updateSettings({ name, email }, 'data');
  });
}

if (updatePasswordUser) {
  updatePasswordUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML =
      'Updating Password';
    let passwordCurrent = document.getElementById('password-current').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;
    console.log(passwordCurrent, password, passwordConfirm);
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').innerHTML = 'Saved Password';

    passwordCurrent = userPasswordForm['password-current'].value = '';
    password = userPasswordForm['password'].value = '';
    passwordConfirm = userPasswordForm['password-confirm'].value = '';
  });
}
