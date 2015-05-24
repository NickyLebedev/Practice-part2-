var uniqueId = function() {
	var date = Date.now();
	var rand = Math.random() * Math.random();

	return Math.floor(date * rand).toString();
};

var message = function(user, tex) {
	return {
		author: user,
		text: tex,
		id: uniqueId()
	};
};

var appState = {
	mainUrl: 'chat',
	messageList:[],
	userLogin: 'Nicky',
	token: 'TN11K11EN'
};

function loop(continueWith) {
	restore();
	setTimeout(function() {
		loop(continueWith)} ,1000);
}

function run() {
	var appContainer = document.getElementsByClassName('b3radius')[0];
	appContainer.addEventListener('click', delegateEvent);

	var username = restoreLogin();
	if(username != null)
	 createLogin(username);

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

		if(!(responseText == "")) {

			var response = JSON.parse(responseText);
			appState.token = response.token;
			var finalList = doEventList(response.messages, response.events);
			createAllMessages(finalList);
		}

		continueWith && continueWith();
	});
}

function findMessageIndex(messages,message) {
	var id = message.id;
	var i = 0;
	var found = false;
	while(i < messages.length&&!found) {
		if(messages[i].id == id) {
			found = true;
		}
		else {
			i++;
		}
	}
	return i;
}

function doEventList(toAdd, events) {
	var items = document.getElementsByClassName('items')[0];
	var list = items.children;
	var index;
	var finalList = toAdd;
	for(var j = 0;j < events.length; j++) {
		index = findMessageIndex(appState.messageList, events[j]);
		if(index == appState.messageList.length) {
			index = findMessageIndex(finalList,events[j]);
			if(index!=finalList.length) {
				finalList[index].author = events[j].author;
				finalList[index].text = events[j].text;
			}
		}
		else {
			appState.messageList[index].text = events[j].text;
			list[index].firstChild.childNodes[1].textContent = events[j].author;
			list[index].firstChild.childNodes[2].textContent = events[j].text;
			if(events[j].text == "Message was deleted") {
				list[index].firstChild.firstChild.removeChild(list[index].firstChild.firstChild.firstChild);
				list[index].firstChild.firstChild.removeChild(list[index].firstChild.firstChild.firstChild);
			}
		}
	}
	return finalList;
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

function onEditButtonClick(event) {
	var mess = event.target.parentElement.parentElement.parentElement;
	var id = mess.attributes['data-id'].value;

	for(var i = 0; i < appState.messageList.length; i++) {
		if(appState.messageList[i].id != id)
			continue;

		var nMes = prompt("Edit message", appState.messageList[i].text);
		var mes = message(appState.messageList[i].author, nMes);
		mes.id = id;
		//updateItem(mess, mes);


		put(appState.mainUrl,JSON.stringify(mes), function() {
			setIndicatorTrue();
			output("true");

			restore();
		});
		return;
	}
}

function deleteMes(evtObj) {
	var mes = evtObj.target.parentNode.parentNode.parentNode;
	var id = mes.attributes['data-id'].value;
	var mes = message("user", "message");
	mes.id = id;
	del(appState.mainUrl,JSON.stringify(mes),function(){
		setIndicatorTrue();
		output("true");
		restore();
	});
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
	var htmlAsText = '<table data-id="">'+'<tr>'+'<td><button class="dBut">delete</button>'+
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
	tableItem.setAttribute('data-id', mes.id);
	tableItem.firstChild.childNodes[1].textContent = mes.author;
	tableItem.firstChild.childNodes[2].textContent = mes.text;
	if(mes.author == "System message: ") {
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

function put(url, data, continueWith, continueWithError) {
	ajax('PUT', url, data, continueWith, continueWithError);
}

function del(url, data, continueWith, continueWithError) {
	ajax('DELETE', url, data, continueWith, continueWithError);
}

function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();

	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4)
			return;

		if(xhr.status != 200 && xhr.status != 304) {
			continueWithError('Error on the server side, response ' + xhr.status);
			return;
		}

		if(isError(xhr.responseText) && xhr.status != 304) {
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
	//output(err.toString());
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
	//console.error(message);
	//output(message);
}