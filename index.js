//Useful knowledge
// serverItems
// 0 = IPADDRESS
// 1 = SERVERNAME
// 2 = BOOLEAN FOR AVAIBLE WEBSERVER
// 3 = ARRAY OF SERVICE NAMES
// 4 = ARRAY OF PORTS
// 5 = ARRAY OF SSL
//Import Required Items
const jQuery = require('jquery');
const electron = require('electron');
const {
  ipcRenderer
} = electron;
const shell = require('electron').shell;
window.jQuery = window.$ = jQuery;

// assuming $ is jQuery
$(document).on('click', 'a[href^="http"]', function (event) {
  event.preventDefault();
  shell.openExternal(this.href);
});
//Wait for dom to load
window.onload = function () {
  //Grabs the ul 
  var ul = document.querySelector('ul');
  //Add
  ipcRenderer.on("server:add", function (e, serverItems) {
    //Make Ul collapsible
    ul.className = "collapsible"
    //Create li
    const li = document.createElement('li');
    // Create Header
    const headerDiv = document.createElement('div');
    headerDiv.className = "collapsible-header";
    const i = document.createElement('i');
    i.className = 'material-icons';
    const materialText = document.createTextNode('arrow_drop_down small');
    const serverTitle = document.createTextNode(serverItems[1] + " - " + serverItems[0]);
    i.appendChild(materialText);
    //Create Open in browser Button
    const openButton = document.createElement('a');
    if (serverItems[2]) {
      const openArt = document.createElement('i');
      const openText = document.createTextNode('open_in_browser');
      openButton.setAttribute('href', "http://" + serverItems[0])
      openButton.className = 'secondary-content';
      openArt.className = 'material-icons';
      openArt.appendChild(openText);
      openButton.appendChild(openArt);
    }
    headerDiv.appendChild(i);
    headerDiv.appendChild(serverTitle);
    headerDiv.appendChild(openButton);
    li.appendChild(headerDiv);
    // Create Body
    const bodyDiv = document.createElement('div');
    bodyDiv.className = "collapsible-body";
    // Create Collection inside of body
    const servicesUl = document.createElement('ul');
    servicesUl.className = 'collection';
    for (let index = 0; index < serverItems[3].length; index++) {
      // Get Name And Port Number of Service
      const servicenames = serverItems[3][index];
      const serviceports = serverItems[4][index];
      const serviceSSL = serverItems[5][index];
      // Create the title and port num
      const serviceLi = document.createElement('li');
      serviceLi.className = 'collection-item';
      const serviceNameSpan = document.createElement('span');
      serviceNameSpan.className = 'title';
      const serviceNameText = document.createTextNode(servicenames + " : " + serviceports);
      // Create Online Badge
      const onlineSpan = document.createElement('span');
      onlineSpan.className = "badge grey"
      onlineSpan.setAttribute('name', serverItems[0] + serviceports);
      var onlineText = document.createTextNode('Checking');
      ipcRenderer.send('service:check:status', [serverItems[0], serviceports,serviceSSL]);
      onlineSpan.appendChild(onlineText);
      // Create Secondary Object for link
      const openButton = document.createElement('a');
      const openArt = document.createElement('i');
      const openText = document.createTextNode('delete');
      openButton.setAttribute('onclick', 'deleteService(this);');
      openButton.className = 'secondary-content';
      openArt.className = 'material-icons';
      openArt.appendChild(openText);
      openButton.appendChild(openArt);
      serviceLi.appendChild(openButton);
      // Bind Stuff Together
      serviceNameSpan.appendChild(serviceNameText);
      serviceLi.appendChild(serviceNameSpan);
      serviceLi.appendChild(onlineSpan)
      servicesUl.appendChild(serviceLi);
    }
    // Bind Service Ul to body
    bodyDiv.appendChild(servicesUl);


    //Connect body Div to li
    li.appendChild(bodyDiv);
    li.className = 'active';
    ul.appendChild(li);
    //Make sure materialize items are initalized
    M.AutoInit();

  });
}
//Clear
ipcRenderer.on("server:clear", function (e, serverItems) {
  ul.parentNode.removeChild(ul);
  ul = document.createElement('ul');
  const body = document.querySelector('body');
  body.appendChild(ul);
});
// ServerItems
// 0 - Item Array - 0 - IP ADDRESS - 1 - PORT
// 1 - On/Offline
ipcRenderer.on('service:reply:status', function (e, serverItems) {
  console.log("Got " + "service:reply:status")
  console.log(serverItems)
  onlineSpan = document.getElementsByName(serverItems[0][0] + serverItems[0][1])[0];
  if (serverItems[1]) {
    onlineSpan.className = "badge green";
    onlineSpan.textContent = "Online"
  } else {
    onlineSpan.className = "badge red";
    onlineSpan.textContent = "Offline"

  }
});


function openAddWindow() {
  ipcRenderer.send('open:server:add');
}

function deleteService(e) {
  console.log('Delete Service');
  var topDiv = e.parentNode;
  while (topDiv.firstChild) {
    topDiv.removeChild(topDiv.firstChild);
  }
  topDiv.parentNode.removeChild(topDiv);
};