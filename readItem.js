const { BrowserWindow } = require('electron')
//offscreen Browser window
let offScreenWindow
let id = 0
module.exports = (url,callback) => {  // ***Calling a fn within a fn

    //Create offscreen window
    offScreenWindow = new BrowserWindow({
        width : 500,
        height : 500,
        show : false ,
        webPreferences : {
            offscreen : true
        }
    })

    //Load item Url
    offScreenWindow.loadURL(url)

    //wait for content to finish load
    offScreenWindow.webContents.on('did-finish-load',e => {
        //Get Page Title
        let title = offScreenWindow.getTitle()
        //Get screenshot thumbanail
        offScreenWindow.webContents.capturePage(image => {
            //Get image as data URL
            let screenshot = image.toDataURL()
            id = id + 1
            //Execute callback with new item object
            callback({title,screenshot,url,id}) //sending data as object

            //Clean Up
            offScreenWindow.close()
            offScreenWindow = null
        })
    })
}