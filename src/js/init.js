var APP_ID = 'vQLSvBdTgnXTooYhaS52sJeg-gzGzoHsz';
var APP_KEY = 'Xj9qAEQtQyM9bfc52opYGDKN';
var token = ''

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var Song = AV.Object.extend('Song');
var song = new Song();

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

function updateSongs(fileobj){
  var new_song = document.createElement('li')
  var song_no = document.createElement('span')
  var song_title = document.createElement('div')
  var info_wrapper = document.createElement('div')
  var song_singer = document.createElement('div')
  var song_duration = document.createElement('div')

  new_song.className = 'song_item fadeIn'
  song_no.className = 'no'
  song_title.className = 'song_title'
  info_wrapper.className = 'info_wrapper'
  song_singer.className = 'song_singer'
  song_duration.className = 'song_duration'
  
  new_song.appendChild(song_no)
  new_song.appendChild(song_title)
  new_song.appendChild(info_wrapper)
  info_wrapper.appendChild(song_singer)
  info_wrapper.appendChild(song_duration)

  song_no.innerHTML = document.querySelectorAll('.song_item').length+1+'.'
  song_title.innerHTML = fileobj["title"]
  song_singer.innerHTML = fileobj["singer"]
  song_duration.innerHTML = fileobj['duration']

  song_items.appendChild(new_song)
  new_song.addEventListener('click',e=>{
    console.log(e.currentTarget)
    if(add_song.className.indexOf('active') == -1){
      edit_song.className += ' active'
      edit_song(fileobj)
    }
  })
}

function song_save(fileobj){
  song.save({
    title: fileobj["title"] || '未知',
    singer: fileobj["singer"]|| '未知',
    duration: fileobj['duration'] || '',
    size: fileobj["size"],
    url:'http://pjjtb28cj.bkt.clouddn.com/'+encodeURIComponent(fileobj["file"].name)
  }).then(function(object) {
    console.log(object)
  })
}

window.addEventListener('load',getToken,false)
window.addEventListener('load',song_list,false)

