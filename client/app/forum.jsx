let currentT; 

const handleThread = (e) => { //Makes threads, refreshes them
    e.preventDefault();

    if ($("#threadTitle").val() == '' || $("#threadText").val() == '') {
        handleError("Threads must have title and text!");
        return false;
    }

    sendAjax('POST', $("#threadForm").attr("action"), $("#threadForm").serialize(), function () {
        loadThreads();
    })

    return false;
};

const handleComments = (e) => { //Makes comment, refreshes them
    e.preventDefault();
    document.querySelector("#currentTinForm").value = currentT._id;
    if($("#commentText").val() == ''){
        handleError("Comment must have text!")
        return false;
    }

    sendAjax('POST', $("#commentForm").attr("action"), $("#commentForm").serialize(), function () {
        //loadComments();
    }) 
    return false;
}

const ThreadList = function (props) { //Lists out all active threads
    if (props.threads.length === 0) {
        return (
            <div className="threadList">
                <h3 className="emptyThread">No Threads Found</h3>
            </div>
        );
    }

    const threadNodes = props.threads.map(function (thread) { //Indiviudal nodes
        return (
            <div key={thread._id} className="thread">
                <button type="button" className="threadTitle" onClick={() =>
                    openThread(thread)
                }>
                    {thread.title}</button>
            </div>
        )
    });

    return (
        <div className="threadList">
            {threadNodes}
        </div>
    )
};

const CommentList = function (props) { //Lists all comments of current thread
    if (props.comments.length === 0) {
        return (
            <div className="commentList">
                <h3 className="emptyThread">No Comments</h3>
            </div>
        );
    }

    const commentNodes = props.comments.map(function (comment) { //Indiviudal nodes
        return (
            <div key={comment._id} className="comment">
                <p>{comment.text}</p>
            </div>
        )
    });

    return (
        <div className="commentList">
            {commentNodes}
        </div>
    )
};

const loadThreads = () => { //Loads up the threads
    sendAjax('GET', '/getThreads', null, (data) => {
        ReactDOM.render(
            <ThreadList threads={data.threads} />, document.querySelector("#threads")
        );
    });
};

const loadComments = () => { //Loads comments NOT COMPLETE MUST LOAD BASED ON OPEN THREAD
    sendAjax('GET', '/getComments', null, (data) => {
        ReactDOM.render(
            <CommentList comments={data.comments}/>, document.querySelector("#comments")
        );
    });
}

const loadUser = () => { //Loads the current user so we can get their name
    sendAjax('GET', '/getUser', null, (data) => {
        let title = document.querySelector("#title");
        title.innerHTML += `, ${data.username}!`;
        ReactDOM.render(
            <h3 id="userDisplay">Logged in as: {data.username}</h3>, document.querySelector("#userDisplay")
        );
    });
};

const ThreadForm = (props) => { //Form for creating threads
    return (
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

const CommentForm = (props) => { //Form for creating comments
    return (
        <form id="commentForm"
            onSubmit={handleComments}
            name="commentForm"
            action="/comment"
            className="commentForm"
        >
            <label htmlFor="title">Title: </label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id="currentTinForm" type="hidden" name="thread" value={currentT} />
            <textarea id="commentText" id="textBox" name="text" placeholder="Comment Here" />
            <br></br>
            <input className="makeCommentSubmit" type="submit" value="Comment" />
        </form>
    );
};

const Advertisement = (props) => { //Popup ad, buy today!
    return (
        <div id="ad">
            <h1>This could be your ad! Buy it today!</h1>
            <button type="button" className="closeAd" onClick={() =>
                    closeAd()
                }>
                    Close</button>
        </div>
    );
};

const closeAd = function (){ //Closes the ad
    $('.serverad').animate({bottom:"-60px"},600);
}

const openThread = function (thread) { //Opens the selected thread
    currentT = thread;
    ReactDOM.render(
        <div id="currentThread">
            <h1>{thread.title}</h1>
            <h3>OP: {thread.ownerUser}</h3>
            <h3>Rating: {thread.rating}</h3>
            <hr></hr>
            <button type="button" className="voteButton" onClick={() =>
                    upVote(thread, true)
                }>Upvote</button>
            <button type="button" className="voteButton" onClick={() =>
                    downVote(thread, false)
                }>Downvote</button>
            <p>{thread.text}</p>
        </div>, document.querySelector("#openThread")
    )
};

const upVote = function (thread) { //Upvotes the open thread
    sendAjax('GET', '/upVote', thread, (threadReturned) => {
        openThread(threadReturned);
    });
};

const downVote = function (thread) { //Downvotes the open thread
    sendAjax('GET', '/downVote', thread, (threadReturned) => {
        openThread(threadReturned);
    });
};

const setup = function (csrf) { //Sets up the page

    ReactDOM.render(
        <ThreadForm csrf={csrf} />, document.querySelector("#startThread")
    );
    
    ReactDOM.render(
        <CommentForm csrf={csrf} />, document.querySelector("#startComment")
    );
    
    ReactDOM.render(
        <ThreadList csrf={csrf} threads={[]} />, document.querySelector("#threads")
    );
    ReactDOM.render(
        <Advertisement />, document.querySelector(".serverAd")
    )
    ReactDOM.render(
        <CommentList csrf={csrf} comments={[]} />, document.querySelector("#comments")
    );
    loadThreads();
    loadUser();
};

const getToken = () => { //Gets the csrf token
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () { //animates the ad after some time
    getToken();
    $('.serverad').delay(3000).animate({bottom:"30px"},600);
});