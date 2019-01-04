function active_song(song,fileobj){
  var song_item = document.querySelectorAll('.song_item')
  song_item = [...song_item]
  if(song.className.indexOf('active') == -1){
    song_item.map(item=>{
      if(item != song && item.className.indexOf('active') > -1){
        item.classList.remove('active')
      }
    })
    song.className += ' active'
    edit_song(song,fileobj)
  }
}

function edit_song(song,fileobj){
  var title = fileobj["title"]
  var singer = fileobj["singer"]
  var link = fileobj["url"]
  var cover = fileobj["cover"] || ""
  var lyric = fileobj["lyric"] || ""
  var add_song = document.querySelector('.add_song')
  var edit_song = document.querySelector('.edit_inner')
  if(edit_song === null){
    if(add_song) add_song.classList.remove('active')
    add_edit.innerHTML = ''

    var template = `<div class="add-edit-container fadeIn"><div class="edit_inner"><div class="edit_item"><label for="edit_name">歌名: </label><input type="text" class="edit_input" id="edit_name" value=${title}></div><div class="edit_item"><label for="edit_singer">歌手: </label><input type="text" class="edit_input" id="edit_singer" value=${singer}></div><div class="edit_item"><label for="edit_link">歌曲链接: </label><input type="text" class="edit_input" id="edit_link" value=${link}></div><div class="edit_item"><label for="edit_cover">封面链接: </label><input type="text" class="edit_input" id="edit_cover" value=${cover}></div><div class="edit_item"><label for="edit_lyric">歌词链接: </label><input type="text" class="edit_input" id="edit_lyric" value=${lyric}></div><div class="edit_button_container"><div class="edit_button">保存更改</div><div class="remove_button">删除歌曲</div></div></div></div>`
    add_edit.insertAdjacentHTML('beforeend',template)
  }else{
    var edit_input = edit_song.querySelectorAll('.edit_input')
    edit_input[0].value = title
    edit_input[1].value = singer
    edit_input[2].value = link
    edit_input[3].value = cover
    edit_input[4].value = lyric
  }

  document.querySelector('.edit_button').outerHTML = document.querySelector('.edit_button').outerHTML
  document.querySelector('.remove_button').outerHTML = document.querySelector('.remove_button').outerHTML

  var edit_btn = document.querySelector('.edit_button')
  var remove_btn = document.querySelector('.remove_button')
  // edit_btn = edit_btn.cloneNode(true)
  function edit_listener(){
    update_song_db(fileobj.id)  
    update_song_list(song)
  }
  function remove_listener(){
    remove_song_db(fileobj.id)
    remove_song_list(song)
  }
  edit_btn.addEventListener('click',edit_listener)
  remove_btn.addEventListener('click',remove_listener)
}

function remove_song_list(song){
  song.classList.add('fadeOut')
  var edit_item = document.querySelectorAll('.edit_input')
  for(var i=0;i<edit_item.length;i++){
    edit_item[i].value = ''
  }
  setTimeout(()=>{
    song.remove()
    var items = document.querySelectorAll('.no')
    for(var i=0; i<items.length; i++){
      items[i].innerHTML = (i+1) + '.'
    }
  },500)
}
function update_song_list(song){
  var edit_item = document.querySelectorAll('.edit_input')
  song.querySelector('.song_title').innerHTML = edit_item[0].value
  song.querySelector('.song_singer').innerHTML = edit_item[1].value
}

function update_song_db(id){
  var item = AV.Object.createWithoutData('Song', id)
  var edit_item = document.querySelectorAll('.edit_input')
  item.set('title',edit_item[0].value)
  item.set('singer',edit_item[1].value)
  item.set('url',edit_item[2].value)
  item.set('cover',edit_item[3].value)
  item.set('lyric',edit_item[4].value)
  item.save()
  //更新后如何自动刷新结果
}
function remove_song_db(id){
  var item = AV.Object.createWithoutData('Song', id)
  item.destroy().then(function (success) {
    console.log('remove done')
  }, function (error) {
    // 删除失败
  });
}
