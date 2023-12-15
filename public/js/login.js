export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    });
    if (res.data.status === 'success') {
      console.log(res);
      // Redirect to a different page after successful login
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    // Handle errors or show an error message
    // showAlert('error', err.response.data.message);
  }
};
