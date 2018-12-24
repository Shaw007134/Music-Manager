var APP_ID = 'vQLSvBdTgnXTooYhaS52sJeg-gzGzoHsz';
var APP_KEY = 'Xj9qAEQtQyM9bfc52opYGDKN';
var token = ''

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var Song = AV.Object.extend('Song');
var song = new Song();


function song_save(filename){
  if(filename.indexOf('-')>0){
    var title = filename.split('-')[1].replace(' ','')
    var singer = filename.split('-')[0].replace(' ','')
    console.log('title: '+title)
    console.log('singer: '+singer)
  }
  song.save({
    title: title || '未知',
    singer: singer || '未知',
    url:'http://pjjtb28cj.bkt.clouddn.com/'+encodeURIComponent(filename)
  }).then(function(object) {
    console.log(object)
  })
}

function song_list(){
  var query = new AV.Query('Song')
  console.log(query)
  // query.objectClass.fetchAll().then(function(obj){
  //   console.log(obj)
  // })
}
window.addEventListener('load',song_list,false)

var element = $('.droppable')[0];
var file_array = []
var process_array = []
createDropzone(element,filehandler)


function getToken(){
  // var xhr = new XMLHttpRequest()
  // xhr.open('GET','http://47.104.228.220:3000/uptoken')
  // xhr.onreadystatechange = function(){
  //   if(xhr.readyState === 4 && xhr.status === 200){
  //     token = JSON.parse(xhr.responseText).uptoken
  //     console.log(token)
  //   }
  // }
  // xhr.send()
  token = "NHoNtSaQ4SA9yOtrQ3Ah9gy8J8ADM1dxOnt-yI7X:gb3UQCOZmBxwAcy9bE2bDtO-QCg=:eyJzY29wZSI6Im11c2ljLW1hbmFnZXIiLCJkZWFkbGluZSI6MTU0NTUzNzk0N30="
}
window.addEventListener('load',getToken,false)