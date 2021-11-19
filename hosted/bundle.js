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

var ThreadList = function ThreadList(props) {
  if (props.threads.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "threadList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyThread"
    }, "No Threads Found"));
  }

  var threadNodes = props.threads.map(function (thread) {
    return /*#__PURE__*/React.createElement("div", {
      key: thread._id,
      className: "thread"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "threadTitle"
    }, thread.title));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "threadList"
  }, threadNodes);
};

var loadThreads = function loadThreads() {
  sendAjax('GET', '/getThreads', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ThreadList, {
      threads: data.threads
    }), document.querySelector("#threads"));
  });
};

var ThreadForm = function ThreadForm(props) {
  var _React$createElement;

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

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ThreadForm, {
    csrf: csrf
  }), document.querySelector("#startThread"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ThreadList, {
    csrf: csrf,
    threads: []
  }), document.querySelector("#threads"));
  loadThreads();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  alert(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
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
