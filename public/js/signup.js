import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  console.log({ name, email, password, passwordConfirm });
  try {
    const res = await fetch('http://127.0.0.1:3900/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 'success') {
      showAlert('success', 'Signup Successfully!');

      setTimeout(() => {
        location.assign('/');
      }, 500);
    } else {
      showAlert('error', data.message);
      console.log(error);
    }
  } catch (error) {
    showAlert('error', error.message);
    console.log(error);
  }
};
