const electron = require('electron');
const {
  ipcRenderer
} = electron;
var serviceCount = 0;

window.onload = function () {
  // Make Sure Materialize is initalized
  M.AutoInit();
  const form = document.querySelector('form');
  const formdiv = document.getElementById('formdiv');
  form.addEventListener('submit', submitForm);
  // Add Service at beginning
  createServiceDom();

  function submitForm(e) {
    e.preventDefault();
    const serverIp = document.querySelector('#ip').value;
    const serverName = document.querySelector('#name').value;
    const serverWeb = document.querySelector('#webserver').checked;
    var serverServicesNamesElements = document.getElementsByName('serviceName');
    var serverServicesNames = [];
    serverServicesNamesElements.forEach(element => {
      console.log(element.value);
      serverServicesNames.push(element.value);
    });
    var serverServicesPorts = [];
    var serverServicesPortsElements = document.getElementsByName('portNumber');
    serverServicesPortsElements.forEach(element => {
      serverServicesPorts.push(element.value);
    });
    var serverServicesSSL =[];
    var serverServicesSSLElements = document.getElementsByName('sslInput');
   serverServicesSSLElements.forEach(element =>{
      serverServicesSSL.push(element.checked);
    });
    var serverItems = [serverIp, serverName, serverWeb, serverServicesNames, serverServicesPorts,serverServicesSSL];
    ipcRenderer.send('server:add', serverItems);
  }

  ipcRenderer.on("add:service", function (e) {
    createServiceDom();
  });

};

function createServiceDom() {
  serviceCount++;
  // Create Row Div
  const serviceRow = document.createElement('div');
  serviceRow.className = 'row'
  // Create input-field div col s6
  const serviceDiv = document.createElement('div');
  serviceDiv.className = 'input-field col s6';
  // Create label 
  const serviceLabel = document.createElement('label');
  const serviceLabelText = document.createTextNode("Service Name");
  serviceLabel.setAttribute('for', 'Service' + serviceCount + 'Name');
  serviceLabel.appendChild(serviceLabelText);
  // Create service name input
  const serviceNameInput = document.createElement('input');
  serviceNameInput.setAttribute('name', 'serviceName');
  serviceNameInput.setAttribute('type', 'text');
  serviceNameInput.setAttribute('id', 'Service' + serviceCount + 'Name');
  // Hook Top Div Together
  serviceDiv.appendChild(serviceLabel);
  serviceDiv.appendChild(serviceNameInput);

  // Create input-field div col 3
  const portDiv = document.createElement('div');
  portDiv.className = "input-field col s3";
  // Create Label
  const portLabel = document.createElement('label');
  const portLabelText = document.createTextNode("Port Number");
  portLabel.setAttribute('for', 'port' + serviceCount + 'number');
  portLabel.appendChild(portLabelText);
  // Create Port Number Input
  const portNumberInput = document.createElement('input');
  portNumberInput.setAttribute('name', 'portNumber');
  portNumberInput.setAttribute('type', 'number');
  portNumberInput.setAttribute('min', '1');
  portNumberInput.setAttribute('max', '65535')
  portNumberInput.setAttribute('id', 'port' + serviceCount + 'number');
  // Create Switch for SSL/TLS
  const sslSwitchDiv = document.createElement('div');
  sslSwitchDiv.className = "switch col 2"
  const sslSwitchTextDiv = document.createElement('div');
  const sslSwitchTextDivText = document.createTextNode('SSL/TLS');
  // Hook switchTextDiv & switchTextDivText Together
  sslSwitchTextDiv.appendChild(sslSwitchTextDivText);
  const sslSwitchLabel = document.createElement('label');
  const sslSwitchInput = document.createElement('input');
  sslSwitchInput.id = 'ssl' + serviceCount;
  sslSwitchInput.type = 'checkbox';
  sslSwitchInput.setAttribute('name','sslInput');
  const sslSwitchSpan = document.createElement('span');
  sslSwitchSpan.className = 'lever';
  // Hook ssl switch all together
  sslSwitchLabel.appendChild(sslSwitchInput);
  sslSwitchLabel.appendChild(sslSwitchSpan);
  sslSwitchDiv.appendChild(sslSwitchTextDiv);
  sslSwitchDiv.appendChild(sslSwitchLabel)
  // Create Trash Div div col 1
  const trashDiv = document.createElement('div');
  trashDiv.className = "col s1";
  // Create Trash Icon 
  const trashA = document.createElement('a');
  trashA.setAttribute('onclick', 'deleteService(this);');
  trashA.className = 'secondary-content';
  const trashI = document.createElement('i');
  trashI.className = 'material-icons';
  const trashText = document.createTextNode('delete');
  trashI.appendChild(trashText);
  trashA.appendChild(trashI);
  trashDiv.appendChild(trashA);
  // Hook Lower Div Together
  portDiv.appendChild(portLabel);
  portDiv.appendChild(portNumberInput);

  // Hook together top and bottom
  serviceRow.appendChild(serviceDiv);
  serviceRow.appendChild(portDiv);
  serviceRow.appendChild(sslSwitchDiv);
  serviceRow.appendChild(trashDiv);

  // Hook all into main form
  formdiv.appendChild(serviceRow);
};

function deleteService(e) {
  console.log('Delete Service');
  var topDiv = e.parentNode.parentNode;
  while (topDiv.firstChild) {
    topDiv.removeChild(topDiv.firstChild);
  }
  topDiv.parentNode.removeChild(topDiv);
};