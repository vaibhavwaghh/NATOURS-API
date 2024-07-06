import { showAlert } from './alerts'; // Importing a function named "showAlert" from a local file named "alert"

// Defining a function named "updateSettings" that takes two parameters: "data" and "type"
export const updatePhotoName = async (data) => {
  // console.log(type);
  console.log('CURRENT DATA -->', data);

  const xhr = new XMLHttpRequest();
  const url = `http://127.0.0.1:3900/api/v1/users/updateMe`;
  xhr.open('PATCH', url); // Specify the URL and method
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Request was successful, handle response
        const response = xhr.responseText;
        console.log('Response:', response);
        showAlert('success', ` Updated Successfully!`); // Show a success message to the user

        // Reload the page after successful update
        window.location.reload();
      } else {
        // Request failed
        showAlert('error', message);
      }
    }
  };

  xhr.send(data);
};
// Send FormData as the request body
export const updatePassword = async (data) => {
  try {
    const url = `http://127.0.0.1:3900/api/v1/users/updateMyPassword`;

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
