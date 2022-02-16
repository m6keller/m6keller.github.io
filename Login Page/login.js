
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault(); // prevent submitting data
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "participant" && password === "pass") {
        sessionStorage.setItem( "perm", "priv" ); // fetchEventLists.ts will get this item and will show private events
        window.location.href = "http://m6keller.github.io/EventsPage/eventList.html";
    } else if( username === "user" && password === "pass" ) {
        sessionStorage.setItem( "perm", "pub" );
        window.location.href = "http://m6keller.github.io/EventsPage/eventList.html";
    } else {
        alert("Incorrect credentials"); // not redirected if incorrect credentials are entered
    }
})