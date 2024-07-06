import '@babel/polyfill';
import { login, logout } from './login';
import { updatePassword, updatePhotoName } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const updateNameEmail = document.querySelector('.form-user-data');
const updatePasswordUser = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const signupBtn = document.querySelector('.form--signup');
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
  updateNameEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0]; // Assuming you want to upload the first selected file

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    await updatePhotoName(formData, 'data');
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
    let data = { passwordCurrent, password, passwordConfirm };
    await updatePassword(data, 'password');

    document.querySelector('.btn--save-password').innerHTML = 'Saved Password';

    passwordCurrent = userPasswordForm['password-current'].value = '';
    password = userPasswordForm['password'].value = '';
    passwordConfirm = userPasswordForm['password-confirm'].value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    console.log('BUTTON WAS CLICKED');
    e.target.innerHTML = 'Processing...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}

if (signupBtn) {
  signupBtn.addEventListener('submit', (e) => {
    // Preventing the default form submission behavior
    e.preventDefault();

    // Getting the name, email, password and passwordConfirm values from the form inputs
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('passwordconfirm').value;

    // Calling the signup function with name, email, password and passwordConfirm values
    signup(name, email, password, passwordConfirm);
  });
}
