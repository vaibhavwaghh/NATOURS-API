import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';
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
  updateNameEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0]; // Assuming you want to upload the first selected file

    // const formData = new FormData(); // Create a FormData object
    // formData.append('name', name); // Append name field
    // formData.append('email', email); // Append email field
    // formData.append('photo', photo); // Append photo field
    // console.log('Form Data:', formData);
    // const data = {
    //   name: document.getElementById('name').value,
    //   email: document.getElementById('email').value,
    //   // You might handle the photo differently, like converting it to base64 or sending it separately based on the API requirements
    // };
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Add data to FormData
    formData.append('name', name);
    formData.append('email', email);
    formData.append('photo', photo);

    xhr.open('PATCH', 'http://127.0.0.1:3900/api/v1/users/updateMe'); // Specify the URL and method
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Request was successful, handle response
          const response = xhr.responseText;
          console.log('Response:', response);
        } else {
          // Request failed
          console.error('Request failed with status:', xhr.status);
        }
      }
    };

    // Send FormData as the request body
    xhr.send(formData);
  });
  //     const form = new FormData();
  //     form.append('name', document.getElementById('name').value);
  //     form.append('email', document.getElementById('email').value);
  //     form.append('photo', document.getElementById('photo').files[0]);
  //     let name = document.getElementById('name').value;
  //     let email = document.getElementById('email').value;
  //     let photo = document.getElementById('photo').files[0];
  //     console.log('BADVU', form);
  //     alert(form.photo);

  //     updateSettings({ name, email }, 'data');
  //   });
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
