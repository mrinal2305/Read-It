//Add item to index.html
const items = document.getElementById('items')
let fs = require('fs')   // file server in node.js
const { remote } = require('electron')

//Getting from local storage
let storage = JSON.parse(localStorage.getItem('read-item')) || []

let readerJS // storing readJS.js file as string in readerJS

// Delete item fn
exports.delete_item = ()=>{
  let id = document.getElementsByClassName('read-item selected')[0].id 

  for( var i = 0; i < storage.length; i++){ 
    if ( storage[i].id == id) {
      console.log(storage[i]) 
      storage.splice(i,1)
      console.log(storage)  
      localStorage.setItem('read-item',JSON.stringify(storage)) 
    }    
 }

  //Reloading index.html'       
  remote.getCurrentWindow().reload();  // *** VVI renderer API - "Remote"
}

//Listen for message from BrowserProxyWindow 'readWin' (whose code in reader.js)
window.addEventListener('message',e => { // *** new concept
  // Deleting logic
  this.delete_item()
}) 

//reading file using fs - fileServer
fs.readFile(`${__dirname}/reader.js`,(err , data) => {
  readerJS = data.toString()
})

//Persist Storage
let save = () => {
    localStorage.setItem('read-item',JSON.stringify(storage))
}

// OPEN fn for opening url
exports.open = () => {
  if(!storage.length) return
  let selectedItem = document.getElementsByClassName('read-item selected')[0]
  let contentURL = selectedItem.dataset.url 
  let readWin = window.open(contentURL,'',`
  maxWidth           =  2000,
  maxHeight          =  2000,
  width              =  1200,
  height             =  800,
  backgroundColor    =  #DEDEDE,  
  nodeIntegration    =  1,
  contextIsolation   =  1 
  `)
  
  // Here , readWin is a browserProxyWindow 
  readWin.eval(readerJS) // calling readWin.eval() fn
}

//Add new item
exports.addItem = (item,isNew) => {
    //Creating new div element
    let itemNode = document.createElement('div')
    
    //Adding class to itemNode
    itemNode.setAttribute('class','read-item')  

    //setting data-url attribute
    itemNode.setAttribute('data-url',item.url)

    //Adding inner html
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>` 
    
    //Adding id to div
    itemNode.setAttribute('id',item.id)

    items.appendChild(itemNode) //appenChild ,dom fn take element as argument while append, js fn take string as a fn to append
 
    let itm = {
      screenshot : item.screenshot,
      title      : item.title,
      url        : item.url,
      id         : item.id
    }   
    
    // Appending itemNode to items 
    if(isNew){
    storage.push(itm)
    save()
    remote.getCurrentWindow().reload();
    }

    //Reloading 'index.html'
}
// Showing local storage item
storage.forEach( item => {
  if(item) this.addItem(item)
})

//Creating array of divs
const arrayOfDivs = Array.from(document.getElementsByClassName('read-item'));

//Selecting the item on click
arrayOfDivs.forEach((item) => {
 // Event Listner for click item
  item.addEventListener('click',(e,index) => {
    let indx = index

    //removing all else selected item
    arrayOfDivs.forEach((item, index) => {
      if(index !== indx){
        item.classList.remove('selected');
      }
    })

    item.classList.add('selected');// selecting the item of current index
  }) 
  item.addEventListener('dblclick',this.open)  // Good logic to add event listner here
  // ** ADD open when enter key is pressed
}) 

// Selecting the initial one 
if(arrayOfDivs.length) arrayOfDivs[0].classList.add('selected')
 
// Controlling the selected one with ArrowUp and ArrowDown key
let changeSelection = (e) => {
  let selection = document.getElementsByClassName('read-item selected')[0]
  
  if(selection.nextElementSibling && e == 'ArrowDown'){
  document.getElementsByClassName('read-item selected')[0].nextElementSibling.classList.add('selected')
  selection.classList.remove('selected')
  }  

 else if(selection.previousElementSibling && e == 'ArrowUp'){
    document.getElementsByClassName('read-item selected')[0].previousElementSibling.classList.add('selected')
    selection.classList.remove('selected')
    }  
}
 
// Navigating using up/down arrow key
document.addEventListener('keyup',e=> {
  if(e.key == 'ArrowUp' || e.key == 'ArrowDown'){
    changeSelection(e.key)
  }
})