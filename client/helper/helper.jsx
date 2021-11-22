const handleError = (message) => { //Handles error messages
    alert(message);
};

const redirect = (response) => { //Redirects the user
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => { //Sends Ajax requests
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};