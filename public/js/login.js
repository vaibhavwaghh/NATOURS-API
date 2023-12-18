import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // Sending a POST request to the login endpoint with email and password in the request body
    const res = await fetch('http://127.0.0.1:3900/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Parsing the response data
    let data = await res.json();

    // Logging the response data to the console
    console.log(data);

    // Showing an alert message if the login was successful and redirecting to the home page
    if (data.status === 'success') {
      showAlert('success', 'Logged In successfully');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else if (data.status === 'failed') {
      showAlert('error', data.message);
    }
  } catch (error) {
    // Showing an alert message with the error message if there was an error while sending the request
    alert(error.response.data.message);
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const res = await fetch('http://127.0.0.1:3900/api/v1/users/logout');
    const data = await res.json();

    console.log(data);

    if (data.status === 'success') {
      showAlert('success', 'Logged Out Successfully!');
      window.location.href = '/';
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
