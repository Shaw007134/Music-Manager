var APP_ID = 'vQLSvBdTgnXTooYhaS52sJeg-gzGzoHsz';
var APP_KEY = 'Xj9qAEQtQyM9bfc52opYGDKN';

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
  var objects = []
  Song.fetchAll(objects).then(function (objects) {
    console.log(objects)
  }, function (error) {
    // 异常处理
  });
}
window.addEventListener('load',song_list,false)


var form = document.getElementById('upload-form')
    form.addEventListener('submit',function(el){
      var el = el || window.element
      el.preventDefault()
      var filename = form['file'].files[0].name
      form['key'].value = filename
      var xhr = new XMLHttpRequest()
      var formData = new FormData(form)
      xhr.open("POST",'http://upload.qiniup.com/')
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status ===200){
          console.log(xhr.responseText)
          song_save(filename)
        }
      }
      xhr.send(formData)
    })

    function getToken(){
      var token = document.getElementsByName('token')[0]
      var xhr = new XMLHttpRequest()
      xhr.open('GET','http://47.104.228.220:3000/uptoken')
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
          token.value = JSON.parse(xhr.responseText).uptoken
          console.log(token.value)
        }
      }
      xhr.send()
    }
    window.addEventListener('load',getToken,false)