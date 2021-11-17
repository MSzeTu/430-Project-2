const handleThread = (e) => { //Makes threads, refreshes them
    e.preventDefault();

    if ($("threadTitle").val() == '' || $("threadText").val() == ''){
        handleError("Threads must have title and text!");
        return false;
    }

    sendAjax('POST', $("#threadForm").attr("action"), $("threadForm").serialize(), function() {
        loadThreads();
    })
};

const loadThreads = () => { //loads all threads
    sendAjax('GET', '/getThreads', null, (data) => {
        ReactDOM.render(
            <ThreadList threads={data.threads} />, document.querySelector("#threads")
        );
    });
};

const threadForm = (props) => {
    return(
        <form id="threadForm"
            onSubmit={handleThread}
            name="threadForm"
            action="/forum"
            className="threadForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="threadTitle" type="text" name="title" placeholder="Thread Title" />
            <label htmlFor="text">Text: </label>
            <input id="threadText" type="text" name="text" placeholder="Thread Text" />
            <input className="makeThreadSubmit" type="submit" value="Start Thread" />
        </form>
    );
};