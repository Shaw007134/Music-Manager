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
  // var title = song.querySelector('.song_title').innerHTML
  // var singer = song.querySelector('.song_singer').innerHTML
  // var link = song.firstChild.innerHTML
  var title = fileobj["title"]
  var singer = fileobj["singer"]
  var link = fileobj["url"]
  var cover = fileobj["cover"] || ""
  var lyric = fileobj["lyric"] || ""
  console.log(lyric)
  var add_song = document.querySelector('.add_song')
  var edit_song = document.querySelector('.edit_inner')
  if(edit_song === null){
    if(add_song) add_song.classList.remove('active')
    add_edit.innerHTML = ''
    var edit_container = document.createElement('div')
    edit_container.className="add-edit-container fadeIn"
    var edit_inner = document.createElement('div')
    edit_inner.className = 'edit_inner'

    var edit_name = document.createElement('label')
    var input_name = document.createElement('input')
    input_name.setAttribute('type','text')
    input_name.setAttribute('class','edit_input')
    input_name.value = title
    edit_name.innerHTML = '歌名: '
    input_name.setAttribute('id','edit_name')
    edit_name.setAttribute('for','edit_name')
    var name_container = document.createElement('div')
    name_container.setAttribute('class','edit_item')
    name_container.appendChild(edit_name)
    name_container.appendChild(input_name)

    var edit_singer = document.createElement('label')
    var input_singer = document.createElement('input')
    input_singer.setAttribute('type','text')
    input_singer.setAttribute('class','edit_input')
    input_singer.value = singer
    edit_singer.innerHTML = '歌手: '
    edit_singer.appendChild(input_singer)
    input_singer.setAttribute('id','edit_singer')
    edit_singer.setAttribute('for','edit_singer')
    var singer_container = document.createElement('div')
    singer_container.setAttribute('class','edit_item')
    singer_container.appendChild(edit_singer)
    singer_container.appendChild(input_singer)

    var edit_link = document.createElement('label')
    var input_link = document.createElement('input')
    input_link.setAttribute('type','text')
    input_link.setAttribute('class','edit_input')
    input_link.value = link
    edit_link.innerHTML = '歌曲链接: '
    edit_link.appendChild(input_link)
    input_link.setAttribute('id','edit_link')
    edit_link.setAttribute('for','edit_link')
    var url_container = document.createElement('div')
    url_container.setAttribute('class','edit_item')
    url_container.appendChild(edit_link)
    url_container.appendChild(input_link)

    var edit_cover = document.createElement('label')
    var input_cover = document.createElement('input')
    input_cover.setAttribute('type','text')
    input_cover.setAttribute('class','edit_input')
    input_cover.value = cover
    edit_cover.innerHTML = '封面链接: '
    edit_cover.appendChild(input_cover)
    input_cover.setAttribute('id','edit_cover')
    edit_cover.setAttribute('for','edit_cover')
    var cover_container = document.createElement('div')
    cover_container.setAttribute('class','edit_item')
    cover_container.appendChild(edit_cover)
    cover_container.appendChild(input_cover)

    var edit_lyric = document.createElement('label')
    var input_lyric = document.createElement('input')
    input_lyric.setAttribute('type','text')
    input_lyric.setAttribute('class','edit_input')
    input_lyric.value = lyric
    edit_lyric.innerHTML = '歌词链接: '
    edit_lyric.appendChild(input_lyric)
    input_lyric.setAttribute('id','edit_lyric')
    edit_lyric.setAttribute('for','edit_lyric')
    var lyric_container = document.createElement('div')
    lyric_container.setAttribute('class','edit_item')
    lyric_container.appendChild(edit_lyric)
    lyric_container.appendChild(input_lyric)

    var edit_button_container = document.createElement('div')
    var edit_button = document.createElement('div')
    var remove_button = document.createElement('div')

    edit_button_container.className = 'edit_button_container'
    edit_button.className = 'edit_button'
    remove_button.className = 'remove_button'
    edit_button.innerHTML = '保存更改'
    remove_button.innerHTML = '删除歌曲'
    
    edit_button_container.appendChild(edit_button)
    edit_button_container.appendChild(remove_button)

    edit_inner.appendChild(name_container)
    edit_inner.appendChild(singer_container)
    edit_inner.appendChild(url_container)
    edit_inner.appendChild(cover_container)
    edit_inner.appendChild(lyric_container)
    edit_inner.appendChild(edit_button_container)

    edit_container.appendChild(edit_inner)
    add_edit.appendChild(edit_container)

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
    update_song_db(fileobj)  
    update_song_list(song)
  }
  function remove_listener(){
    remove_song_db(fileobj)
    remove_song_list(song)
  }
  edit_btn.addEventListener('click',edit_listener)
  remove_btn.addEventListener('click',remove_listener)
}

function update_song_db(item){
  song_find(item,edit_callback)
}

function remove_song_db(item){
  song_find(item,remove_callback)
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

function edit_callback(id){
  var item = AV.Object.createWithoutData('Song', id)
  var edit_item = document.querySelectorAll('.edit_input')
  item.set('title',edit_item[0].value)
  item.set('singer',edit_item[1].value)
  item.set('url',edit_item[2].value)
  item.set('cover',edit_item[3].value)
  item.set('lyric',edit_item[4].value)
  item.save()
}
function remove_callback(id){
  var item = AV.Object.createWithoutData('Song', id)
  item.destroy().then(function (success) {
    console.log('remove done')
  }, function (error) {
    // 删除失败
  });
}
