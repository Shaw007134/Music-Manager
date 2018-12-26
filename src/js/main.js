var add_edit = document.querySelector('.add_edit')
var add_song = document.querySelector('.add_song')
var song_items = document.querySelector('.song_items')
var song_item = document.querySelectorAll('.song_item')
song_item = [...song_item]

song_item.map(item=>{
  item.addEventListener('click',function(e){
    
  })
})

add_song.addEventListener('click',function(){
  if(add_song.className.indexOf('active') == -1){
    add_song.className += ' active'
    createDropzone()
  }
})






