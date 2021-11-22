const handleLogin = (e) => { //Handles logins
    e.preventDefault();

    //Checks for empty fields
    if ($("user").val() == '' || $("#pass").val() == '') { 
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('Post', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

const handleSignup = (e) => { //handles signups
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Missing Fields");
        return false;
    }

    //checks for matching passwords
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
};

const handleReset = (e) => { //Handles password resets
    e.preventDefault();

    //Checks for empty fields
    if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Missing Fields");
        return false;
    }

    //Checks for matching passwords
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), redirect);
    return false;
};

const LoginWindow = (props) => { //Window for user login
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => { //Window for signup
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
};

const PassWindow = (props) => { //Window for Password reset
    return (
        <form id="passForm"
            name="passForm"
            onSubmit={handleReset}
            action="/reset"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="old password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="passSubmit" type="submit" value="Change Password" />
        </form>
    );
}

const createLoginWindow = (csrf) => { //Creates login window
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => { //Creates signup window
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createPassWindow = (csrf) => { //creates password reset window
    ReactDOM.render(
        <PassWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => { //Sets up the page
    const loginButton = document.querySelector("#loginButton");
    const signupButtom = document.querySelector("#signupButton");
    const passButton = document.querySelector("#passButton")

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    passButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPassWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default view
};

const getToken = () => { //Gets CSRF token
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () { //runs on doc ready
    getToken();
});