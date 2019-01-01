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

var add_edit = document.querySelector('.add_edit')
var add_song = document.querySelector('.add_song')
var song_items = document.querySelector('.song_items')


var Song = AV.Object.extend('Song');

var token = ''
function getToken(){
  var xhr = new XMLHttpRequest()
  xhr.open('GET','http://47.104.228.220:3000/uptoken')
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
      token = JSON.parse(xhr.responseText).uptoken
      console.log(token)
    }
  }
  xhr.send()
  token = "NHoNtSaQ4SA9yOtrQ3Ah9gy8J8ADM1dxOnt-yI7X:gb3UQCOZmBxwAcy9bE2bDtO-QCg=:eyJzY29wZSI6Im11c2ljLW1hbmFnZXIiLCJkZWFkbGluZSI6MTU0NTUzNzk0N30="
}

function song_list(){
  var query = new AV.Query('Song')
  query.find().then(function(objects){
    objects.map(object=>{
      updateSongs(object['attributes'])
    })
  })
}

function song_find(item,callback){
  var query = new AV.Query('Song')
  query.find().then(function(objects){
    for(var i=0; i<objects.length; i++){
      var object = objects[i]
      if(object['attributes']['title'] === item['title'] 
        && object['attributes']['singer'] === item['singer']){
          callback.call(null,object.id)
          break
        }
    }  
  })
}

function updateSongs(fileobj){
  var new_song = document.createElement('li')
  var song_no = document.createElement('span')
  var song_title = document.createElement('div')
  var info_wrapper = document.createElement('div')
  var song_singer = document.createElement('div')
  var song_duration = document.createElement('div')
  // var song_link = document.createElement('div')


  new_song.className = 'song_item fadeIn'
  song_no.className = 'no'
  song_title.className = 'song_title'
  info_wrapper.className = 'info_wrapper'
  song_singer.className = 'song_singer'
  song_duration.className = 'song_duration'
  // song_link.className = 'hidden'

  // new_song.appendChild(song_link)
  new_song.appendChild(song_no)
  new_song.appendChild(song_title)
  new_song.appendChild(info_wrapper)
  info_wrapper.appendChild(song_singer)
  info_wrapper.appendChild(song_duration)

  song_no.innerHTML = document.querySelectorAll('.song_item').length+1+'.'
  song_title.innerHTML = fileobj["title"]
  // song_link.innerHTML = fileobj["url"]
  song_singer.innerHTML = fileobj["singer"]
  song_duration.innerHTML = fileobj['duration']

  song_items.appendChild(new_song)
  new_song.addEventListener('click',e=>{
    if(e.currentTarget.className.indexOf('active') == -1){
      active_song(e.currentTarget,fileobj)
    }
  })
}

function song_save(fileobj){
  var song = new Song();
  song.save({
    title: fileobj["title"] || '未知',
    singer: fileobj["singer"]|| '未知',
    duration: fileobj["duration"] || '',
    size: fileobj["size"],
    url:fileobj["url"],
    cover: ''
  }).then(function(object) {
    console.log(fileobj["title"]+'保存成功')
  })
}

window.addEventListener('load',getToken,false)
window.addEventListener('load',song_list,false)

add_song.addEventListener('click',function(){
  if(add_song.className.indexOf('active') == -1){
    add_edit.innerHTML = ''
    add_song.className += ' active'
    var song_item = document.querySelectorAll('.song_item')
    song_item = [...song_item]
    song_item.map(item=>{
      if(item.className.indexOf('active') > -1){
        item.classList.remove('active')
      }
    })
    createDropzone()
  }
})