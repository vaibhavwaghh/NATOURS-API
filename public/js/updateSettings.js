import { showAlert } from './alerts'; // Importing a function named "showAlert" from a local file named "alert"

// Defining a function named "updateSettings" that takes two parameters: "data" and "type"
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `http://127.0.0.1:3900/api/v1/users/updateMyPassword`
        : `http://127.0.0.1:3900/api/v1/users/updateMe`;

    const res = await fetch(url, {
      // Sending a PATCH request to the server to update the user's data
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
      }),
    });

    const resData = await res.json(); // Parsing the response data as JSON and assigning it to a variable named "resData"

    // Extracting status and message from resData using destructuring assignment
    const { status, message } = resData;

    // If the server response status is "success"
    if (status === 'success') {
      showAlert('success', ` Updated Successfully!`); // Show a success message to the user

      // Reload the page after successful update
      setTimeout(() => {
        location.reload(); // Reload the page after a delay of 1000 milliseconds (1 second)
      }, 1000);
    } else {
      // If the server response status is not "success"
      showAlert('error', message); // Show an error message to the user
    }
  } catch (error) {
    console.log(error);
    // If there is an error in the try block
    showAlert('error', error.message); // Show an error message to the user
  }
};
