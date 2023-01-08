const container = document.getElementById('container');
const formHeader = document.getElementById('formHeader');
const inputs = document.getElementById('inputs');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const checkbox = document.getElementById('checkbox');
const signupBtn = document.getElementById('signup');
const loadLoginFormBtn = document.getElementById('loadLoginForm');
const signupChoices = document.getElementById('signupChoices');
const h5 = document.getElementById('h5');

const symbols = /[~!@#$%^&*()-+=`;:'"?<>,]/;

/* the "accounts" where the users accounts will save in there */
let accounts;

if(localStorage.getItem('accounts') === null){
    /* define accounts list as an array */
    accounts = [];
}else{
    accounts = JSON.parse(localStorage.getItem('accounts'));
}

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkInputs();

    /* if checkInputs() function returns true, the signup() function is called to create the user account. */
    if(checkInputs()){
        signUp();
    }
})
loadLoginFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadLoginForm();
})
/* loadLoginForm() function is called when the user try to login */
function loadLoginForm(){

    /* change SIGN UP to LOG IN on the form header */
    formHeader.innerText = `LOG IN`;

    /* set Username and Password as inputs on LOG IN form */
    inputs.innerHTML = `
        <div class="input-control">
            <input id="input" type="username" placeholder="Username" autocomplete="off">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
            <small>Error Message</small>
        </div>
        <div class="input-control">
            <input id="password" type="password" placeholder="Password">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
            <small>Error Message</small>
        </div>
    `;

    /* set Log In button and Sign up form suggestion */
    signupChoices.innerHTML = `
        <div class="log-in-choices-container">
            <div class="log-in-choices">
                <button class="log-in" id="login">Log in</button>
                <h5 class="sign-up-suggestion">Do not have an account?<a href=""> Sign up</a></h5>
            </div>
            <h5 class="another-way"><a href="" id="anotherWay">Try another way</a>
        </div>
    `;

    h5.innerText = `Or log in with:`;

    const loginBtn = document.getElementById('login');
    const input = document.getElementById('input');
    const password = document.getElementById('password');
    const anotherWay = document.getElementById('anotherWay');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        /* check entered Username and Password */
        checkLoginInputs(input, password);
    })

    /* set another way for login with Email */
    anotherWay.addEventListener('click', (e) => {
        e.preventDefault();

        /* set Email and password as inputs */
        inputs.innerHTML = `
        <div class="input-control">
            <input id="input" type="email" placeholder="Email" autocomplete="off">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
            <small>Error Message</small>
        </div>
        <div class="input-control">
            <input id="password" type="password" placeholder="Password">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
            <small>Error Message</small>
        </div>
    `;

    const input = document.getElementById('input');
    const password = document.getElementById('password');

    /* load LOG IN form which the Username required */
    anotherWay.addEventListener('click', (e) => {
        e.preventDefault();
        loadLoginForm();
    })

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        /* check entered Email and Password */
        checkLoginInputs(input, password);
    }) 
})

    function checkLoginInputs(input, password){

        /* the codes below execute on LOG IN form when the Email required */
        if(input.type === 'email'){
            if(input.value === ''){
                setError(input, 'The Email cannot be empty!');
            }else if(!emailValidation(input.value)){
                setError(input, 'The Email not valid!');
            }else if(checkAvailability(input.value, input, password)){
                setSuccess(input);
                if(password.value === ''){
                    setError(password, 'The Password cannot be empty!');
                }else if(password.value.length < 8){
                        setError(password, 'The Password must has at least 8 characters!');
                }else if(verifyAccount(input, password)){
                    setSuccess(password); /* when the Email and Password are match */
                }else{
                    setError(password, 'The Email and Password do not match!')
                }
            }else{
                setError(input, 'The Email does not exist!');
            }
        }else{
            /* the codes below execute on LOG IN form when the Username required */
            if(input.value === ''){
                setError(input, 'The Username cannot be empty!');
            }else if(symbols.test(input.value)){
                    setError(input, 'The Username cannot contains symbols!');
            }else if(checkAvailability(input.value, input)){
                setSuccess(input);
                    if(password.value === ''){
                        setError(password, 'The Password cannot be empty!');
                    }else if(password.value.length < 8){
                            setError(password, 'The Password must has at least 8 characters!');
                    }else if(verifyAccount(input, password)){
                        setSuccess(password); /* when the Username and Password are match */
                    }else{
                        setError(password, 'The Username and Password do not match!')
                    }
            }else{
                setError(input, 'The Username does not exist!');
            }
        }
        
        /* check matching the Password with the entered Email or Username */
        function verifyAccount(input, password){
            let verify;
            
            /* if the user try with Email and Password */
            if(input.type === 'email'){
                let account = accounts.find(acc => acc.email == input.value);
                if(account.password == password.value){
                    verify = true;
                }else{
                    verify = false;
                }
            }else{
                /* if the user try with Username and Password */
                let account = accounts.find(acc => acc.username == input.value);
                if(account.password == password.value){
                    verify = true;
                }else{
                    verify = false;
                }
            }
    
            return verify;
        }
    }
}
/* checkInputs() function is called when the user click on sign up button and return true when all the inputs are valid */
function checkInputs(){
    let validUsername;
    let validEmail;
    let validPassword;

    /* check username validation */
    if(username.value === ''){
        setError(username, 'The Username cannot be empty!');
    }else if(symbols.test(username.value)){
        setError(username, 'The Username cannot contains symbols!');
    }else if(checkAvailability(username.value)){
        setError(username, 'The Username has already taken!');
    }else{
        setSuccess(username);
        validUsername = true;
    }

    /* check email validation */
    if(email.value === ''){
        setError(email, 'The Email cannot be empty!');
    }else if(!emailValidation(email.value)){
        setError(email, 'The Email not valid!');
    }else if(checkAvailability(email.value)){
        setError(email, 'The Email has already taken!');
    }else{
        setSuccess(email);
        validEmail = true;
    }

    /* check password validation */
    if(password.value === ''){
        setError(password, 'The Password cannot be empty!');
    }else if(password.value.length < 8){
        setError(password, 'The Password must has at least 8 characters!');
    }else{
        setSuccess(password);
        validPassword = true;
    }
    
    /* check checkbox */
    if(!checkbox.checked){
        setError(checkbox, '');
    }else{
        const checkboxControl = checkbox.parentElement;
        checkboxControl.className = 'checkbox-control success';
    }

    if(validUsername  && validEmail && validPassword && checkbox.checked){
        return true;
    }
}
/* setError() function is called when the user input isn't valid */
function setError(input, message){
    /* set error for username, email, and password */
    if(input === username || email || password, message){
        const inputControl = input.parentElement;
        const small = inputControl.querySelector('small');

        small.innerText = message;
        inputControl.className = 'input-control error';
    }else{/* set error for checkbox */
        const checkboxControl = input.parentElement;
        checkboxControl.className = 'checkbox-control error';
    }
}
/* setSuccess() function is called when the user input is valid */
function setSuccess(input){
    const inputControl = input.parentElement;
    inputControl.className = 'input-control success';
}

function emailValidation(email){
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}
/* to create user account */
function signUp(){
    /* create account as an object */
    const newAccount = {
        username: username.value,
        email: email.value,
        password: password.value
    }
    /* push newAccount in accounts */
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}
/* checking username and email for Availability */
function checkAvailability(input, inputType){
    let usernameVerify;
    let emailVerify;

    /* the codes below execute on SIGN UP form */
    if(formHeader.innerText == 'SIGN UP'){
        /* checking the Username */
        if(input === username.value){
            let account = accounts.find(acc => acc.username == username.value);
            if(account){
                usernameVerify = true;
            }else{
                usernameVerify = false;
            }
        }else{
            /* checking the Email */
            let account = accounts.find(acc => acc.email == email.value);
            if(account){
                emailVerify = true;
            }else{
                emailVerify = false;
            }
        }
    }else{
        /* the codes below execute on LOG IN form */
        /* checking the Email */
        if(inputType.type === 'email'){
            let account = accounts.find(acc => acc.email == input);
            if(account){
                emailVerify = true;
            }else{
                emailVerify = false;
            }
            
        }else{
            /* checking the Username */
            let account = accounts.find(acc => acc.username == input);
            if(account){
                usernameVerify = true;
            }else{
                usernameVerify = false;
            }
        }
    }
    
    return usernameVerify || emailVerify;
}