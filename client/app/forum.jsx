const handleThread = (e) => { //Makes threads, refreshes them
    e.preventDefault();

    if ($("#threadTitle").val() == '' || $("#threadText").val() == ''){
        handleError("Threads must have title and text!");
        return false;
    }

    sendAjax('POST', $("#threadForm").attr("action"), $("#threadForm").serialize(), function() {
        loadThreads();
    })

    return false;
};

const ThreadList = function (props) {
    if(props.threads.length === 0){
        return (
            <div className="threadList">
                <h3 className="emptyThread">No Threads Found</h3>
            </div>
        );
    }

    const threadNodes = props.threads.map(function (thread){
        return(
            <div key={thread._id} className="thread">
                <h3 className="threadTitle">{thread.title}</h3>
            </div>
        )
    });

    return (
        <div className="threadList">
            {threadNodes}
        </div>
    )
};

const loadThreads = () =>{
    sendAjax('GET', '/getThreads', null, (data) => {
        ReactDOM.render(
            <ThreadList threads={data.threads} />, document.querySelector("#threads")
        );
    });
};

const ThreadForm = (props) => {
    return(
        <form id="threadForm"
            onSubmit={handleThread}
            name="threadForm"
            action="/forum"
            className="threadForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="threadTitle" type="text" name="title" placeholder="Thread Title" />
            <br></br>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <textarea id="threadText" id="textBox" name="text" placeholder="Thread Text" />
            <br></br>
            <input className="makeThreadSubmit" type="submit" value="Start Thread" />
        </form>
    );
};

const setup = function (csrf) {
    

    ReactDOM.render(
        <ThreadForm csrf={csrf} />, document.querySelector("#startThread")
    );

    ReactDOM.render(
        <ThreadList csrf={csrf} threads={[]} />, document.querySelector("#threads")
    );
    loadThreads();

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});