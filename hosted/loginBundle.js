"use strict";

var handleLogin = function handleLogin(e) {
  //Handles logins
  e.preventDefault(); //Checks for empty fields

  if ($("user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  sendAjax('Post', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  //handles signups
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Missing Fields");
    return false;
  } //checks for matching passwords


  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var handleReset = function handleReset(e) {
  //Handles password resets
  e.preventDefault(); //Checks for empty fields

  if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Missing Fields");
    return false;
  } //Checks for matching passwords


  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  //Window for user login
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }));
};

var SignupWindow = function SignupWindow(props) {
  //Window for signup
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  }));
};

var PassWindow = function PassWindow(props) {
  //Window for Password reset
  return /*#__PURE__*/React.createElement("form", {
    id: "passForm",
    name: "passForm",
    onSubmit: handleReset,
    action: "/reset",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "passSubmit",
    type: "submit",
    value: "Change Password"
  }));
};

var createLoginWindow = function createLoginWindow(csrf) {
  //Creates login window
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  //Creates signup window
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createPassWindow = function createPassWindow(csrf) {
  //creates password reset window
  ReactDOM.render( /*#__PURE__*/React.createElement(PassWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  //Sets up the page
  var loginButton = document.querySelector("#loginButton");
  var signupButtom = document.querySelector("#signupButton");
  var passButton = document.querySelector("#passButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  passButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //default view
};

var getToken = function getToken() {
  //Gets CSRF token
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  //runs on doc ready
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  //Handles error messages
  alert(message);
};

var redirect = function redirect(response) {
  //Redirects the user
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  //Sends Ajax requests
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
