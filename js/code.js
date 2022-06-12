const urlBase = "http://thesmallestproject.xyz/LAMPAPI";
const extension = "php";
const src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";

let userId = 0;
let firstName = "";
let lastName = "";
//window.onload = displayContacts();

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
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML =
						"User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "displayContacts.html";
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister(event) {
	event.preventDefault();
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword1").value;
	let password2 = document.getElementById("loginPassword2").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

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
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		//window.location.href = "index.html";
	} else {
		document.getElementById("userName").innerHTML =
			"Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
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

function doDeleteContact(contactID)
{
    if (confirm("Are you sure you want to delete this contact?")) 
	{
        let tmp = {ID: contactID};
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/Delete.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
					console.log("Contact deleted.");
                    //document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted!";
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            //document.getElementById("contactDeleteResult").innerHTML = err.message;
        }
    }
}

function doAddContact() {
	readCookie();

	var first = document.getElementById("firstName").value;
	var last = document.getElementById("lastName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

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
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
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

	// TODO: Update API with the data in newInfo
	// IDK how the update info works so this might be tricky. A suggestion with lots of effort required:
	// Set the user data to an array that is persistent and updated any time we query new contacts
	// Create a function for the building table rows based on what is in that array (move the existing logic to it)
	// Make a userID column that is ineditable or some other way of finding their ID
	// Use that ID to get the old data in the persistent array and delete it
	// Then add the new contact

	// I may not have collected the right data for the API call.
	// I can consult as needed, but if you can think of a good way to collect it please do so.
});

$(document).on("click", ".deletebtn", function () {
	readCookie();

	// button < container < td cell < tr - collect tr
	const tr = $(this).parent().parent().parent().get(0);
	// FirstName, LastName, Phone, Email, ID properties of the original version (not the changed stuff)
	const oldContact = getFullContactObj(tr);

	doDeleteContact(oldContact.ID);
	displayContacts();
	let counter = 0;

	// $(this)
	// 	.parent()
	// 	.parent()
	// 	.siblings("td")
	// 	.each(function () {
	// 		var content = $(this).html();
	// 		console.log(this, content);
	// 		if (counter === 0) infoToDelete.firstName = content;
	// 		else if (counter === 1) infoToDelete.lastName = content;
	// 		else if (counter === 2) infoToDelete.phone = content;
	// 		else if (counter === 3) infoToDelete.email = content;
	// 		counter++;
	// 	});

	// console.log(infoToDelete);

	// TODO: Delete contact API, make sure table refreshes
	// Again, I may not have collected the right data for the API call.
	// I can consult as needed, but if you can think of a good way to collect it please do so.
});
