var uniqueId = function() {
	var date = Date.now();
	var rand = Math.random() * Math.random();

	return Math.floor(date * rand).toString();	
};

var message = function(user, tex) {
	return {
		author: user,
		text: tex
	};
};

var appState = {
	mainUrl: 'chat',
	messageList:[],
	userLogin: 'Nicky',
	token: 'TN11EN'
};

function loop(continueWith) {
	restore();
	setTimeout(function() {
	loop(continueWith)} ,1000);
}

function run() {
	var appContainer = document.getElementsByClassName('b3radius')[0];
	appContainer.addEventListener('click', delegateEvent);

	/*var username = restoreLogin();
	createLogin(username);*/

	loop();
}

function createAllMessages(allMessages) {
	for (var i = 0; i < allMessages.length; i++)
		addToMessageInternal(allMessages[i]);
}

function restore(continueWith) {
	var url = appState.mainUrl + '?token=' + appState.token;

	get(url, function(responseText){
		setIndicatorTrue();
		output("true");

		var response = JSON.parse(responseText);
		appState.token = response.token;
		var finalList = response.messages;
		createAllMessages(finalList);

		continueWith && continueWith();
	});
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click' && evtObj.target.classList.contains('log_send')){
		onAddButtonClickSend(evtObj);
	}
	if (evtObj.type === 'click' && evtObj.target.classList.contains('log_img')) {
        onLogInButtonClick(evtObj);
    }
    if (evtObj.type === 'click' && evtObj.target.classList.contains('log_rename')) {
        onRenameButtonClick(evtObj);
    }
    if (evtObj.type === 'click' && evtObj.target.classList.contains('edBut')) {
        onEditButtonClick(evtObj);
    }
    if (evtObj.type === 'click' && evtObj.target.classList.contains('dBut')) {
        deleteMes(evtObj);
    }
}

function onAddButtonClickSend() {
	var sendText = document.getElementById('message_box');
	//var login = document.getElementsByClassName('user_name')[0];
	var newMes = message(appState.userLogin+":", sendText.value);

	if(sendText.value == '')
		return;

	sendText.value = '';
	post(appState.mainUrl, JSON.stringify(newMes), function() {
		setIndicatorTrue();
		output("true");
		restore();
	});
}

function onRenameButtonClick() {
    document.getElementById('username').value = document.getElementsByClassName('user_name')[0].firstChild.nodeValue;
}

function onLogInButtonClick() {
    var login = document.getElementById('username');
    addLogin(login.value);
    login.value = '';
}

function addLogin(value) {
   if (!value) {
        return;
    }

    var login = document.getElementsByClassName('user_name')[0];
    var text = appState.userLogin + " change name to " + value;
    appState.userLogin = value;
    var newMes = message("System message: ", text);

    post(appState.mainUrl, JSON.stringify(newMes), function(){
		setIndicatorTrue();
		output("true");
		restore();
	});

    login.removeChild(login.childNodes[0]);
    login.appendChild(document.createTextNode(value.toString()));

    store(appState.userLogin);
}

function createItem(mes) {
	var tmp = document.createElement('table');
	var htmlAsText = '<table>'+'<tr>'+'<td><button class="dBut">delete</button>'+
	'<button class="edBut">edit</button></td>'+'<td></td><td></td></tr></table>';
	tmp.innerHTML = htmlAsText;
	updateItem(tmp.firstChild, mes);

	return tmp.firstChild;
}

function addToMessageInternal(mes) {
	var item = createItem(mes);
	var items = document.getElementsByClassName('items')[0];

	appState.messageList.push(mes);
	items.appendChild(item);
}

function updateItem(tableItem, mes) {
	//tableItem.setAttribute('data-id', mes.id);
	tableItem.firstChild.childNodes[1].textContent = mes.author;
	tableItem.firstChild.childNodes[2].textContent = mes.text;
	if(mes.user == "System message: ") {
		tableItem.firstChild.firstChild.removeChild(tableItem.firstChild.firstChild.firstChild);
		tableItem.firstChild.firstChild.removeChild(tableItem.firstChild.firstChild.firstChild);
	}
}

function setIndicatorFalse() {
	var circle = document.getElementsByClassName("indicator")[0];
	circle.setAttribute("fill","red");
}

function setIndicatorTrue() {
	var circle = document.getElementsByClassName("indicator")[0];
	circle.setAttribute("fill","green");
}

function output(value){
	var output = document.getElementById('output');

	output.innerText = JSON.stringify(value, null, 2);
}

function get(url, continueWith, continueWithError) {
	ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
	ajax('POST', url, data, continueWith, continueWithError);	
}

function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();

	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4)
			return;

		if(xhr.status != 200) {
			continueWithError('Error on the server side, response ' + xhr.status);
			return;
		}

		if(isError(xhr.responseText)) {
			continueWithError('Error on the server side, response ' + xhr.responseText);
			return;
		}

		continueWith(xhr.responseText);
	};    

    xhr.ontimeout = function () {
    	ontinueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
}

window.onerror = function(err) {
	output(err.toString());
}

function isError(text) {
	if(text == "")
		return false;
	
	try {
		var obj = JSON.parse(text);
	} catch(ex) {
		return true;
	}

	return !!obj.error;
}

function createLogin(username) {
	var login = document.getElementsByClassName('user_name')[0];
	var value = username;
	appState.userLogin = value;
	login.removeChild(login.childNodes[0]);
    login.appendChild(document.createTextNode(value.toString()));
}

function store(login) {

	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
	localStorage.setItem("MathSpeaker login", JSON.stringify(login));
}

function restoreLogin() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	var item = localStorage.getItem("MathSpeaker login");

	return item && JSON.parse(item);
}

function defaultErrorHandler(message) {
	setIndicatorFalse();
	console.error(message);
	output(message);
}