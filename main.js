const electron = require('electron');
const url = require('url');
const path = require('path');
const request = require('request');

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
} = electron;

let mainWindow;
let addWindow;

// Listen for ready
app.on('ready', function () {
  mainWindow = new BrowserWindow({});
  // Load html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));
  // Quit app on close
  mainWindow.on('close', function () {
    app.quit();
  });
  mainWindow.on('focus', function () {
    mainWindow.setMenu(Menu.buildFromTemplate(mainMenuTemplate));
  });
  // Build Menu from Template
  mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert Menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function CreateAddWindow() {
  addWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "Add Server",
    // frame: false
  });
  // Load html
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'add.html'),
    protocol: 'file',
    slashes: true
  }));
  // Build Menu From Template
  addMenu = Menu.buildFromTemplate(addMenuTemplate);
  // Insert Menu
  Menu.setApplicationMenu(addMenu);
  // Garbage Collection
  addWindow.on('focus', function () {
    addWindow.setMenu(Menu.buildFromTemplate(addMenuTemplate));
  });
  addWindow.on('close', function () {
    mainWindow.setMenu(Menu.buildFromTemplate(mainMenuTemplate));
    addWindow = null;

  });
}
// Create Add Menu Template
const addMenuTemplate = [{
  label: 'File',
  submenu: [{
    label: 'Add Service',
    accelerator: 'CmdOrCtrl+N',
    click() {
      AddService();
    }
  }, {
    label: 'Toggle Dev Tools',
    accelerator: 'CmdOrCtrl+I',
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    }
  }, {
    label: "Close Window",
    accelerator: 'CmdOrCtrl+W',
    click() {
      addWindow.close();
    }
  }, {
    role: 'reload',
    accelerator: "CmdOrCtrl+R"
  }]
}];
// Open Server Add
ipcMain.on('open:server:add', function (e) {
  CreateAddWindow();
});
// Catch Server Add
ipcMain.on('server:add', function (e, serverItems) {
  console.log(serverItems);
  mainWindow.webContents.send('server:add', serverItems);
  // addWindow.close();
});
// Catch Service Status
// Items
// 0 - IP ADDRESS
// 1 - PORT
ipcMain.on('service:check:status', function (e, itemArray) {
  var headerStr = 'http://';
  if (itemArray[2] == true) {
    headerStr = 'https://';
  }
  request(headerStr + itemArray[0] + ":" + itemArray[1], function (error, response, body) {
    if (!error) {
      console.log(itemArray[0] + ":" + itemArray[1] + " - ONLINE");
      e.sender.send('service:reply:status', [itemArray, true]);
      // e.returnValue = 'URL UP';
    } else {
      console.log(itemArray[0] + ":" + itemArray[1] + " - OFFLINE");
      e.sender.send('service:reply:status', [itemArray, false]);
      // e.returnValue = 'URL DOWN';
    }
  });
});


function AddService() {
  console.log("AddServicePressed");
  addWindow.webContents.send('add:service');
}
// Create Menu Template
const mainMenuTemplate = [{
  label: 'File',
  submenu: [{
    label: 'Add Server',
    accelerator: 'CmdOrCtrl+N',
    click() {
      CreateAddWindow();
    }
  }, {
    label: 'Delete Server'
  }, {
    label: 'Delete All Servers',
    click() {
      mainWindow.webContents.send('server:clear');
    }
  }, {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click() {
      app.quit();
    }
  }]

}];

// If Darwin Fix Title Bar
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add Dev Tools
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [{
      label: 'Toggle Dev Tools',
      accelerator: 'CmdOrCtrl+I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }, {
      role: 'reload',
      accelerator: "CmdOrCtrl+R"
    }]
  });
}