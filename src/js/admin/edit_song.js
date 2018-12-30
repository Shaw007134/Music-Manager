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
    edit_name.appendChild(input_name)

    var edit_singer = document.createElement('label')
    var input_singer = document.createElement('input')
    input_singer.setAttribute('type','text')
    input_singer.setAttribute('class','edit_input')
    input_singer.value = singer
    edit_singer.innerHTML = '歌手: '
    edit_singer.appendChild(input_singer)

    var edit_link = document.createElement('label')
    var input_link = document.createElement('input')
    input_link.setAttribute('type','text')
    input_link.setAttribute('class','edit_input')
    input_link.value = link
    edit_link.innerHTML = '链接: '
    edit_link.appendChild(input_link)

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

    edit_inner.appendChild(edit_name)
    edit_inner.appendChild(edit_singer)
    edit_inner.appendChild(edit_link)
    edit_inner.appendChild(edit_button_container)

    edit_container.appendChild(edit_inner)
    add_edit.appendChild(edit_container)

  }else{
    var edit_input = edit_song.querySelectorAll('.edit_input')
    edit_input[0].value = title
    edit_input[1].value = singer
    edit_input[2].value = link
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
    // remove_song_db(fileobj)
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
  // song.classList.remove('fadeIn')
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
