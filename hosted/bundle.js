"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handleThread = function handleThread(e) {
  //Makes threads, refreshes them
  e.preventDefault();

  if ($("#threadTitle").val() == '' || $("#threadText").val() == '') {
    handleError("Threads must have title and text!");
    return false;
  }

  sendAjax('POST', $("#threadForm").attr("action"), $("#threadForm").serialize(), function () {
    loadThreads();
  });
  return false;
};

var handleComments = function handleComments(e) {
  //Makes comment, refreshes them
  e.preventDefault();

  if ($("#commentText").val() == '') {
    handleError("Comment must have text!");
    return false;
  }
  /*sendAjax('POST', $("#commentForm").attr("action"), $("#commentForm").serialize(), function () {
      loadComments();
  }) */


  return false;
};

var ThreadList = function ThreadList(props) {
  //Lists out all active threads
  if (props.threads.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "threadList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyThread"
    }, "No Threads Found"));
  }

  var threadNodes = props.threads.map(function (thread) {
    //Indiviudal nodes
    return /*#__PURE__*/React.createElement("div", {
      key: thread._id,
      className: "thread"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "threadTitle",
      onClick: function onClick() {
        return openThread(thread);
      }
    }, thread.title));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "threadList"
  }, threadNodes);
};

var CommentList = function CommentList(props) {
  //Lists all comments of current thread
  if (props.comments.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "commentList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyThread"
    }, "No Comments"));
  }

  var commentNodes = props.comments.map(function (comment) {
    //Indiviudal nodes
    return /*#__PURE__*/React.createElement("div", {
      key: comment._id,
      className: "comment"
    }, /*#__PURE__*/React.createElement("p", null, comment.text));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "commentList"
  }, commentNodes);
};

var loadThreads = function loadThreads() {
  //Loads up the threads
  sendAjax('GET', '/getThreads', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ThreadList, {
      threads: data.threads
    }), document.querySelector("#threads"));
  });
};

var loadComments = function loadComments() {
  //Loads comments NOT COMPLETE MUST LOAD BASED ON OPEN THREAD
  sendAjax('GET', '/getComments', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CommentList, {
      comments: data.comments
    }), document.querySelector("#comments"));
  });
};

var loadUser = function loadUser() {
  //Loads the current user so we can get their name
  sendAjax('GET', '/getUser', null, function (data) {
    var title = document.querySelector("#title");
    title.innerHTML += ", ".concat(data.username, "!");
    ReactDOM.render( /*#__PURE__*/React.createElement("h3", {
      id: "userDisplay"
    }, "Logged in as: ", data.username), document.querySelector("#userDisplay"));
  });
};

var ThreadForm = function ThreadForm(props) {
  var _React$createElement;

  //Form for creating threads
  return /*#__PURE__*/React.createElement("form", {
    id: "threadForm",
    onSubmit: handleThread,
    name: "threadForm",
    action: "/forum",
    className: "threadForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "threadTitle",
    type: "text",
    name: "title",
    placeholder: "Thread Title"
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("textarea", (_React$createElement = {
    id: "threadText"
  }, _defineProperty(_React$createElement, "id", "textBox"), _defineProperty(_React$createElement, "name", "text"), _defineProperty(_React$createElement, "placeholder", "Thread Text"), _React$createElement)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    className: "makeThreadSubmit",
    type: "submit",
    value: "Start Thread"
  }));
};

var CommentForm = function CommentForm(props) {
  var _React$createElement2;

  //Form for creating comments
  return /*#__PURE__*/React.createElement("form", {
    id: "commentForm",
    onSubmit: handleComments,
    name: "commentForm",
    action: "/comment",
    className: "commentForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("textarea", (_React$createElement2 = {
    id: "commentText"
  }, _defineProperty(_React$createElement2, "id", "textBox"), _defineProperty(_React$createElement2, "name", "text"), _defineProperty(_React$createElement2, "placeholder", "Comment Here"), _React$createElement2)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    className: "makeCommentSubmit",
    type: "submit",
    value: "Comment"
  }));
};

var Advertisement = function Advertisement(props) {
  //Popup ad, buy today!
  return /*#__PURE__*/React.createElement("div", {
    id: "ad"
  }, /*#__PURE__*/React.createElement("h1", null, "This could be your ad! Buy it today!"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "closeAd",
    onClick: function onClick() {
      return closeAd();
    }
  }, "Close"));
};

var closeAd = function closeAd() {
  //Closes the ad
  $('.serverad').animate({
    bottom: "-60px"
  }, 600);
};

var openThread = function openThread(thread) {
  //Opens the selected thread
  ReactDOM.render( /*#__PURE__*/React.createElement("div", {
    id: "currentThread"
  }, /*#__PURE__*/React.createElement("h1", null, thread.title), /*#__PURE__*/React.createElement("h3", null, "OP: ", thread.ownerUser), /*#__PURE__*/React.createElement("h3", null, "Rating: ", thread.rating), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "voteButton",
    onClick: function onClick() {
      return upVote(thread, true);
    }
  }, "Upvote"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "voteButton",
    onClick: function onClick() {
      return downVote(thread, false);
    }
  }, "Downvote"), /*#__PURE__*/React.createElement("p", null, thread.text)), document.querySelector("#openThread"));
};

var upVote = function upVote(thread) {
  //Upvotes the open thread
  sendAjax('GET', '/upVote', thread, function (threadReturned) {
    openThread(threadReturned);
  });
};

var downVote = function downVote(thread) {
  //Downvotes the open thread
  sendAjax('GET', '/downVote', thread, function (threadReturned) {
    openThread(threadReturned);
  });
};

var setup = function setup(csrf) {
  //Sets up the page
  ReactDOM.render( /*#__PURE__*/React.createElement(ThreadForm, {
    csrf: csrf
  }), document.querySelector("#startThread"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CommentForm, {
    csrf: csrf
  }), document.querySelector("#startComment"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ThreadList, {
    csrf: csrf,
    threads: []
  }), document.querySelector("#threads"));
  ReactDOM.render( /*#__PURE__*/React.createElement(Advertisement, null), document.querySelector(".serverAd"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CommentList, {
    csrf: csrf,
    comments: []
  }), document.querySelector("#comments"));
  loadThreads();
  loadUser();
};

var getToken = function getToken() {
  //Gets the csrf token
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  //animates the ad after some time
  getToken();
  $('.serverad').delay(3000).animate({
    bottom: "30px"
  }, 600);
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
