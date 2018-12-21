Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};


function createDropzone(element,callback){
  var input = document.createElement('input')
  input.setAttribute('type','file')
  input.setAttribute('multiple',true)
  input.style.display = 'none'


  input.addEventListener('change',triggerCallback,false)
  element.appendChild(input)

  element.addEventListener('dragover',function(e){
    e.preventDefault()
    e.stopPropagation()
    element.classList.add('dragover')
  })

  element.addEventListener('dragleave',function(e){
    e.preventDefault()
    e.stopPropagation()
    var inner = document.getElementsByClassName('droppable')[0]
    if(!inner.contains(e.relatedTarget)){
      element.classList.remove('dragover')
    }
  })

  element.addEventListener('drop',function(e){
    e.preventDefault()
    e.stopPropagation()
    element.classList.remove('dragover')
    triggerCallback(e)
  })

  element.addEventListener('click',function(e){
    input.value = null
    input.click()
  })

  function triggerCallback(e){
    var files
    if(e.dataTransfer){
      files = e.dataTransfer.files
    }else if(e.target){
      files = e.target.files
    }
    callback.call(null,Array.prototype.slice.call(files))
  }
}

function filehandler(files) {
  var fileList = document.getElementsByClassName("upload-items")[0]
  for (var i = 0; i < files.length; i++){ 
    var file = files[i]
    var li = document.createElement('li'); 
    var column = document.createElement('div'); 

    var progress = document.createElement('div'); 
    
    var thumbnail = document.createElement('div'); 

    var img = document.createElement('img'); 
    
    var title = document.createElement('div'); 
    var name = document.createElement('div'); 
    var size = document.createElement('span');
    
    var action = document.createElement('div')
    
    li.setAttribute('class','upload-item')
    column.setAttribute('class','item-column')
    progress.setAttribute('class','item-progress'); 
    thumbnail.setAttribute('class','column-thumbnail')
    title.setAttribute('class','column-title')
    action.setAttribute('class','column-action')

    var song = document.createElement('li'); 
    var song_list = document.querySelector('.song_items')

    var audio = new Audio()
    audio.setAttribute('controls','true')
    var dataurl = window.URL.createObjectURL(file)
    audio.src = dataurl
    song.appendChild(audio)
    song_list.appendChild(song)

    audio.addEventListener("canplay", function(){
      var duration=parseInt(audio.duration);
      console.log(duration)
    });

    name.innerHTML = file.name; 
    size.innerHTML = (parseInt(file.size)/1024/1024).toFixed(2).toString()+' MB'

    thumbnail.appendChild(img)
    title.appendChild(name)
    title.appendChild(size)

    column.appendChild(thumbnail); 
    column.appendChild(title); 
    column.appendChild(action)
      
    li.appendChild(column)
    li.appendChild(progress)
    
    var fileobj = {"file":file,"progress":progress};

    fileList.appendChild(li); 

    file_array.push(fileobj)
    set_progress.call()

  }
}




