// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer , shell} = require('electron')
const items = require('./items')

// DOUBT - HOW TO REMOVE MENU BAR FROM 'readWin' Window
let showModal  = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal      = document.getElementById('modal'),   
    addItem    = document.getElementById('add-item'),
    itemUrl    = document.getElementById('url')
    search     = document.getElementById('search')
// NOTE : We can use window to make gloabl fn that can be used anyWhere
  // Click gloabal  functions
  window.newItem = () => {
      showModal.click()
  }

  window.openItem = () => {
      items.open()
  }

  window.deleteItem = () => {
    items.delete_item()
  }

  window.searchItems = () => {
      search.focus()
  }

  window.openItemNative = () => {
      let selected = document.getElementsByClassName('read-item selected')[0]
      url = selected.dataset.url
      if(selected) shell.openExternal(url)   
  }

const togglemodalButton = () => {
    if(addItem.disabled===true){
        addItem.disabled         = false
        addItem.style.opacity    = 1
        addItem.innerText        = 'Add'
        closeModal.style.display = 'inline-block'
    }else {
        addItem.disabled         = true
        addItem.style.opacity    = 0.5
        addItem.innerText        = 'Adding...'
        closeModal.style.display = 'none'
    }
}

showModal.addEventListener('click',e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})    

closeModal.addEventListener('click',e => {
    modal.style.display = 'none'
})    
// filtering logic with js method
search.addEventListener('keyup', e => {

    // Array methods - Arrays.from() , .include() , .
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    //Hide item that do not match
    let hasMatch = item.innerText.toLowerCase().includes(search.value)
    item.style.display = hasMatch ? 'flex' : 'none'
})

})


addItem.addEventListener('click',(e)=>{
    if(itemUrl.value){
    //send url value to main for taking screenshot
    ipcRenderer.send('new-item',itemUrl.value)
    togglemodalButton()  // Disable add item button
    }
})

ipcRenderer.on('new-item-success',(e,newItem)=>{
    items.addItem(newItem,true)  //calling fn addItem
    //enabling add item button
    togglemodalButton()
    modal.style.display = 'none'
    itemUrl.value = ''
})

itemUrl.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter') addItem.click()
})