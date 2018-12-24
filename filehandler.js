var max_queue = 2

function set_progress(){
  if(file_array.length>0){
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
  var fileobj = fileobj
  var file = fileobj["file"]
  console.log(file)
  var progressBar = fileobj["progress"]
  var xhr = new XMLHttpRequest(); 
  var upload = xhr.upload; 
  var formData = new FormData()
  formData.append('key',file.name)
  formData.append('file',file)
  formData.append('token',token)
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
  xhr.open("POST", "http://upload.qiniup.com/"); 

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
    updateSongList()
    updateProgressList(li,ul)
    process_array.remove(fileobj)
    set_progress()
  }

  function updateProgressList(li,ul){
    ul.scrollTop = li.offsetTop - 75;
  }

  function updateSongList(){
    var song_list = document.querySelector('.song_items')
    var song = document.createElement('li')
    var no = document.createElement('span')
    var song_title = document.createElement('div')
    var song_singer = document.createElement('div')
    var song_duration = document.createElement('div')
    var info_wrapper = document.createElement('div')


    no.className = 'no'
    song_title.className = 'song_title'
    song_singer.className = 'song_singer'
    song_duration.className = 'song_duration'
    info_wrapper.className = 'info_wrapper'
    
    var length = document.querySelectorAll('.song_item').length
    length = length + 1
    no.innerHTML = length + '.'
    song_title.innerHTML = fileobj["file"].name.split(' - ')[1].split('.')[0] || ''
    song_singer.innerHTML = fileobj["file"].name.split(' - ')[0] || ''
    song_duration.innerHTML = calc_time(fileobj["duration"]["minutes"], fileobj["duration"]["seconds"])
    
    song.appendChild(no)
    song.appendChild(song_title)
    info_wrapper.appendChild(song_singer)
    info_wrapper.appendChild(song_duration)
    song.appendChild(info_wrapper)
    song.className = 'song_item'

    song_list.appendChild(song)
  }

  function calc_time(minutes,seconds){
    if(minutes < 10) return "0"+minutes+": "+ (seconds<10?"0"+seconds:seconds)
    if(minutes>10 && minutes < 60)  return minutes+": "+(seconds<10?"0"+seconds:seconds)
    if(minutes > 60){
      var hour = Math.floor(minutes/60)
      if(hour<10){
        var minutes = minutes%60
        if(minutes < 10) return "0"+hour+": "+"0"+minutes+": "+(seconds<10?"0"+seconds:seconds)
        if(minutes>10 && minutes < 60)  return "0"+hour+": "+minutes+": "+(seconds<10?"0"+seconds:seconds)
      }else return hour+": "+"0"+minutes+": "+(seconds<10?"0"+seconds:seconds)
    }
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

