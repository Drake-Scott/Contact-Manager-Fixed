const urlBase = "http://thesmallestproject.xyz/LAMPAPI";
const extension = "php";
const src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";

let userId = 0;
let firstName = "";
let lastName = "";
let username = "";

// Every time we search more contacts, empty this and re-fill it.
let contactRecords = [];

function doLogin(event) {
	event.preventDefault();
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/Login." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				console.log(jsonObject);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginMessage").innerHTML =
						"Incorrect username or password.";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				username = login;

				saveCookie();

				window.location.href = "displayContacts.html";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("loginMessage").innerHTML = err.message;
	}
}

function doRegister(event) {
	event.preventDefault();
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword1").value;
	let password2 = document.getElementById("loginPassword2").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

	// Make sure every field is filled out correctly.
	var infoValidator =
		login === "" ||
		password === "" ||
		password2 === "" ||
		firstName === "" ||
		lastName === "";
	if (infoValidator) {
		alert("Please Enter a valid response in each field.");
		return false;
	}

	if (password != password2) {
		alert("Passwords do not match.");
		return false;
	}

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		login: login,
		password: password,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/Register." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				alert("Account successfully registered!");
				window.location.href = "login.html";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
	return false;
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + minutes * 60 * 1000);
	document.cookie =
		"firstName=" +
		firstName +
		",lastName=" +
		lastName +
		",userId=" +
		userId +
		",username=" +
		username +
		";expires=" +
		date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		console.log(tokens);
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		} else if (tokens[0] == "username") {
			username = tokens[1];
		}
	}

	if (userId < 0) {
		//window.location.href = "index.html";
	} else {
		var str = document.getElementById("userName");
		if (str != null) {
			document.getElementById("userName").innerHTML =
				"Logged in as " + firstName + " " + lastName;
		}
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	username = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "login.html";
}

function doUpdateContact(newInfo) {
	var ID = newInfo.ID;
	var first = newInfo.firstName;
	var last = newInfo.lastName;
	var phone = newInfo.phone;
	var email = newInfo.email;
	let tmp = {
		ID: ID,
		firstName: first,
		lastName: last,
		phone: phone,
		email: email,
	};
	//console.debug("tmp: ".JSON.stringify(tmp));
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/UpdateContact." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Contact Updated.");
				//document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated.";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		//document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}

function doDeleteContact(contactID) {
	if (confirm("Are you sure you want to delete this contact?")) {
		let tmp = { ID: contactID };
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + "/Delete." + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					console.log("Contact deleted.");
					//document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted!";
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			//document.getElementById("contactDeleteResult").innerHTML = err.message;
		}
		location.reload();
	}
}

function doAddContact() {
	readCookie();

	var first = document.getElementById("firstName").value;
	var last = document.getElementById("lastName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

	if (first === "" || last === "" || phone === "" || email === "") {
		alert("Please Enter a valid response in each field.");
		return false;
	}
	if (!email.includes("@")) {
		alert("Please Enter a valid email.");
		return false;
	}

	let tmp = {
		userID: userId,
		firstName: first,
		lastName: last,
		phone: phone,
		email: email,
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/Add." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").innerHTML =
					"Contact has been added";
				alert("Contact successfully added.");
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function showModal() {
	readCookie();
	var accModal = document.getElementById("accModal");
	accModal.style.display = "block";
}

function hideModal() {
	var span = document.getElementsByClassName("close")[0];
	accModal.style.display = "none";
}

function populateTextFields() {
	readCookie();

	console.log({ firstName, lastName, username });
	document.getElementById("firstName").value = firstName;
	document.getElementById("lastName").value = lastName;
	//document.getElementById("loginName").value = username;
}

function doDeleteUser() {
	if (confirm("Are you sure you want to delete this Account?")) {
		readCookie();
		let tmp = { ID: userId };
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + "/DeleteUser." + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					console.log("Account deleted.");
					//document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted!";
					hideModal();
					doLogout();
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			//document.getElementById("contactDeleteResult").innerHTML = err.message;
		}
	}
}

function doUpdateUser(event) {
	// console.log(event);
	// event.preventDefault();

	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;
	//let login = document.getElementById("loginName").value;

	if (first == "" || last == "") {
		alert("Empty fields are not allowed!");
		return;
	}

	let tmp = {
		userID: userId,
		firstName: first,
		lastName: last,
		//login: login,
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/UpdateUser." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//let jsonObject = JSON.parse(xhr.responseText);
				//console.debug("error: " + jsonObject.error);
				
				alert("Updated user successfully! Login again.");
				doLogout();
				// window.location.replace("displayContacts.html")
				// window.reload();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.err(err, err.message);
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchColor() {
	let search = document.getElementById("search").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let contactList = "";

	let tmp = { UserID: userId, search: search };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML =
					"Contact(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}

				document.getElementById("table")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function displayContacts() {
	readCookie();
	console.debug("Current userId: " + userId);
	let search = document.getElementById("search").value;

	let tmp = { UserID: userId, search: search };
	let jsonPayload = JSON.stringify(tmp);
	//console.debug(jsonPayload);
	let url = urlBase + "/SearchContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				// Error of no contacts doesn't return the results property
				if (!jsonObject.results) jsonObject.results = [];
				var tableColumns = [];
				for (var i = 0; i < jsonObject.results.length; i++) {
					for (var key in jsonObject.results[i]) {
						if (tableColumns.indexOf(key) === -1) {
							tableColumns.push(key);
						}
					}
				}

				// Clear all data out of the table then insert the new rows
				var tableBody = document.querySelector("tbody");
				for (let row of document.querySelectorAll("tbody tr"))
					row.remove();

				// Master copy of all contacts and their IDs
				contactRecords = [];

				for (var i = 0; i < jsonObject.results.length; i++) {
					const tr = tableBody.insertRow(-1);
					for (var j = 0; j < tableColumns.length - 1; j++) {
						var tabCell = tr.insertCell(-1);
						tabCell.innerHTML =
							jsonObject.results[i][tableColumns[j]];
					}

					const actionsCell = tr.insertCell(-1);

					const dummy = document.querySelector(
						"#dummy-for-copying > #action-btn-container"
					);
					const newContainer = dummy.cloneNode(true);
					actionsCell.appendChild(newContainer);

					contactRecords.push([tr, jsonObject.results[i]]);
				}
				updateTableEmptyMessage();
				console.log(contactRecords);
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.error(err);
		updateTableEmptyMessage();
	}

	updateTableEmptyMessage();
}

function updateTableEmptyMessage() {
	const noContactHeader = document.getElementById("noContactsMsg"); //.style.display = hidden, block
	if (document.querySelectorAll("tbody tr").length === 0)
		noContactHeader.style.display = "block";
	else noContactHeader.style.display = "none";
}

function getFullContactObj(rowElem) {
	for (let record of contactRecords) {
		console.log(typeof record, typeof rowElem);
		if (record[0] === rowElem) return record[1];
	}
	return null;
}

$(document).on("click", ".editbtn", function () {
	// This is finished, not TODO
	$(this)
		.parent()
		.parent()
		.siblings("td")
		.each(function () {
			var content = $(this).html();
			$(this).html('<input value="' + content + '" />');
		});

	$(this).siblings(".savebtn").show();
	$(this).siblings(".deletebtn").hide();
	$(this).hide();
});

$(document).on("click", ".savebtn", function () {
	readCookie();

	// button < container < td cell < tr - collect tr
	const tr = $(this).parent().parent().parent().get(0);
	// FirstName, LastName, Phone, Email, ID properties of the original version (not the changed stuff)
	const oldInfo = getFullContactObj(tr);

	let counter = 0;
	let newInfo = {
		ID: oldInfo.ID,
	};

	$(this)
		.parent() // button container
		.parent() // td
		.siblings("td")
		.children("input")
		.each(function () {
			var content = $(this).val();
			$(this).html(content);
			$(this).contents().unwrap();
			if (counter === 0) newInfo.firstName = content;
			else if (counter === 1) newInfo.lastName = content;
			else if (counter === 2) newInfo.phone = content;
			else if (counter === 3) newInfo.email = content;
			counter++;
		});

	new $(this).siblings(".editbtn").show();
	$(this).siblings(".deletebtn").show();
	$(this).hide();

	doUpdateContact(newInfo);

	console.log("old info: " + oldInfo);
	console.log("new info: " + newInfo);
});

$(document).on("click", ".deletebtn", function () {
	readCookie();

	// button < container < td cell < tr - collect tr
	const tr = $(this).parent().parent().parent().get(0);
	// FirstName, LastName, Phone, Email, ID properties of the original version (not the changed stuff)
	const oldContact = getFullContactObj(tr);

	doDeleteContact(oldContact.ID);
});
