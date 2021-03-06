var file_array = []
var process_array = []
var max_queue = 2

function createDropzone(parent){

  var template = `<div class="add-edit-container fadeIn"><div class="droppable"><div class="drop-inner"><div class="icon-jfi-cloud-up-o"></div></div><h3 class="caption">Drag and drop files here</h3><p>or</p><div class="browse-button"><span>Browse files</span></div><input type="file" multiple="true" style="display: none;"></div><div class="upload_status"><div class="upload-items"></div></div></div>`
  var parent = document.querySelector('.'+parent)
  parent.insertAdjacentHTML('beforeend',template)

  var input = document.createElement('input')
  input.setAttribute('type','file')
  input.setAttribute('multiple',true)
  input.style.display = 'none'
  
  var droppable = document.querySelector('.droppable')


  input.addEventListener('change',triggerCallback,false)
  droppable.appendChild(input)

  droppable.addEventListener('dragover',function(e){
    e.preventDefault()
    e.stopPropagation()
    droppable.classList.add('dragover')
  })

  droppable.addEventListener('dragleave',function(e){
    e.preventDefault()
    e.stopPropagation()
    var inner = document.getElementsByClassName('droppable')[0]
    if(!inner.contains(e.relatedTarget)){
      droppable.classList.remove('dragover')
    }
  })

  droppable.addEventListener('drop',function(e){
    e.preventDefault()
    e.stopPropagation()
    droppable.classList.remove('dragover')
    triggerCallback(e)
  })

  droppable.addEventListener('click',function(e){
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
    filehandler.call(null,Array.prototype.slice.call(files))
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

    var fileobj = {"file":file,"progress":progress,"duration":''};
    getDuration(fileobj)    
    fileList.appendChild(li); 

    file_array.push(fileobj)
    set_progress.call()
  }
}

function getDuration(fileobj){
  var audio = new Audio()
  audio.setAttribute('controls','true')
  var dataurl = window.URL.createObjectURL(fileobj["file"])
  audio.src = dataurl

  audio.addEventListener("canplay", ()=>{
    var duration=parseInt(audio.duration)
    window.URL.revokeObjectURL(dataurl)
    minutes = (Math.floor(duration/60))
    seconds = duration%60
    seconds = seconds>9?seconds:'0'+seconds
    if(minutes>60){
      hours = Math.floor(minutes/60)
      hours = hours>9?hours:'0'+hours
      minutes = minutes%60
      minutes = minutes>9?minutes:'0'+minutes
      var duration_time = hours+":"+minutes+":"+seconds
    }else{
      minutes = minutes>9?minutes:'0'+minutes
      var duration_time = minutes+":"+seconds
    }
    fileobj["duration"] = duration_time
  });
}

function set_progress(){
  if(file_array.length>0){
    // console.log("file_array: " + file_array.length)
    // console.log("progress_array: " + process_array.length)
    var file_array_length = file_array.length
    var process_array_length = process_array.length
    if(process_array_length <= max_queue){
      var capactiy  = max_queue - process_array_length
      if(capactiy > file_array_length){
        capactiy = file_array_length
      }
      for(var i=0; i<capactiy; i++){
        var temp_obj = file_array.shift()
        process_array.push(temp_obj)
        uploadFile(temp_obj)
      }
    }
  }
}


function uploadFile(fileobj){ 
  var file = fileobj["file"]
  var name = file.name
  
  var size = (parseInt(file.size)/1024/1024).toFixed(2).toString()+' MB'
  if(name.indexOf('-')>0){
    var title = name.split('-')[1].replace(' ','').split('.')[0]
    var singer = name.split('-')[0].replace(' ','') 
  }
  fileobj['title'] = title
  fileobj['singer'] = singer 
  fileobj['size'] = size
  encodeURIComponent
  fileobj['url'] = 'http://47.104.228.220:8888/download?'+encodeURIComponent(name)
  console.log(fileobj['url'])
  var progressBar = fileobj["progress"]
  var xhr = new XMLHttpRequest(); 
  var upload = xhr.upload; 
  var formData = new FormData()
  formData.append('file',file,name)
  // console.log(name)
  // formData.append('key',name)
  // formData.append('token',token)
  var span = document.createElement('span'); 
  var div = document.createElement('div');

  span.textContent = "0%"; 


  progressBar.appendChild(div);
  progressBar.appendChild(span);
  upload.progressbar = progressBar; 

  var action = progressBar.previousSibling.lastChild
  var a = document.createElement('a');
  var span_a = document.createElement('span');
  span_a.className = 'remove icon-jfi-times'
  span_a.setAttribute('title','Remove')
  a.appendChild(span_a)
  action.appendChild(a)

  upload.a = a
  
  // 设置上传文件相关的事件处理函数
  upload.addEventListener("progress", uploadProgress, false); 
  upload.addEventListener("load", uploadSucceed, false); 
  upload.addEventListener("error", uploadError, false); 
  upload.addEventListener("abort", uploadAbort, false); 
  // 上传文件
  xhr.open("POST", "http://47.104.228.220:8888/upload?"+name); 

  a.addEventListener('click',function(e){
    var i = e.currentTarget.firstChild.className
    var li = e.currentTarget.parentNode.parentNode.parentNode
    if(i.indexOf('remove')!=-1){
      xhr.abort()
      if(li){  
        li.classList.add('fadeout')
        setTimeout(()=>{
          li.remove()
        },500)
      }
    }
  }) 
  
  
  xhr.onreadystatechange = function(){
    // console.log('readyState :' + xhr.readyState)
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log(file.name + " response: "+xhr.responseText);
      }
    }
  }
  xhr.send(formData)




  function uploadProgress(event){ 
    if (event.lengthComputable){ 
      // 将进度换算成百分比
      var percentage = Math.round((event.loaded * 100) / event.total); 
      // console.log("percentage:" + percentage); 
      if (percentage < 100){ 
        event.target.progressbar.firstChild.style.width = percentage + "%"; 
        event.target.progressbar.lastChild.textContent = percentage + "%"; 
      }  
    } 
  } 

  function uploadSucceed(event){ 
    var li = event.target.a.parentNode.parentNode.parentNode
    var ul = li.parentNode
    event.target.progressbar.firstChild.style.width = "100%"; 
    event.target.progressbar.lastChild.textContent = "100%"; 
    event.target.progressbar.style.display = 'none';
    event.target.progressbar.className = 'fadeout'
    setTimeout(function(){
      event.target.progressbar.remove()
    })
    var a = event.target.a

    a.firstChild.className = 'success icon-jfi-check'
    a.setAttribute('title','')
    a.addEventListener('mouseover',function(e){
      var i = e.currentTarget.firstChild.className
      if(i.indexOf('success')!=-1){
        e.currentTarget.firstChild.className = 'remove icon-jfi-times'
      }
    })

    a.addEventListener('mouseout',function(e){
      var i = e.currentTarget.firstChild.className
      if(i.indexOf('remove')!=-1){
        e.currentTarget.firstChild.className = 'success icon-jfi-check'
      }
    })
    updateProgress(li,ul)
    function song_save_callback(){
      updateLists(['song_item',fileobj,'song_items',active_song])
    }
    song_save(fileobj,song_save_callback)
    process_array.remove(fileobj)
    set_progress()
  }

  function updateProgress(li,ul){
    ul.scrollTop = li.offsetTop - 175;
  }

  function uploadError(err){ 
    console.log(err)
  }

  function uploadAbort(event){
    var li = event.target.a.parentNode.parentNode.parentNode
    li.classList.add('fadeout')
    setTimeout(()=>{
      li.remove()
    },500)
    process_array.remove(fileobj)
    set_progress()
  }
}



