//Modules
const { remote } = require('electron')

// Menu Template
const template = [
    {
        label: 'Items',
    submenu: [
      {
        label: 'Add New',
        click: window.newItem,
        accelerator: 'CmdOrCtrl+O'
      },
      {
        label: 'Read Item',
        accelerator: 'CmdOrCtrl+Enter',
        click: window.openItem
      },
      {
        label: 'Delete Item',
        accelerator: 'CmdOrCtrl+Backspace',
        click: window.deleteItem
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: window.openItemNative
      },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click: window.searchItems
      }
    ]
    },
    {
        role : 'editMenu'
    },
    {
        role : 'windowMenu'
    }
]

//Set mac specific menu item
if(process.platform === 'darwin'){
    template.unshift({
        label : remote.app.getName(), // give name of app - GOOD CONCEPT
        subMenu : [
            { role: 'about' },
            { type: 'separator'},
            { role: 'services' },
            { type: 'separator'},
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator'},
            { role: 'quit' }
        ]
    })
}
 
//Build Menu
const menu = remote.Menu.buildFromTemplate(template)
 
//Set as main app menu
remote.Menu.setApplicationMenu(menu)