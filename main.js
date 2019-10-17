// Modules to control application life and create native browser window
const electron =  require('electron')
const {app, BrowserWindow , ipcMain} = electron
const windowStateKeeper    = require('electron-window-state')
const path = require('path')
const readItem = require('./readItem')

require('electron-reload')(__dirname)  // reloading renderer .html,.css,.js file automtically
//   , {  
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//Listen to itemUrl on channel - 'new-item'
ipcMain.on('new-item',(e,itemUrl)=>{
    readItem(itemUrl , (item) => {    // ***Passing a fn within a fn
    e.sender.send('new-item-success',item) 
    })
})

function createWindow () {

  // Load the previous state with fallback to defaults
  let state = windowStateKeeper({
    defaultWidth:  500,
    defaultHeight: 650
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: state.x ,  y : state.y,
    width: state.width ,  height: state.height,
    minWidth : 350 ,minHeight: 300,
    webPreferences: {
      nodeIntegration : true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.setMenuBarVisibility(false)   //Removing the menu bar
  // and load the index.html of the app.
  mainWindow.loadFile('renderer/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
