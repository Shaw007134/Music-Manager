var li = document.querySelectorAll('.song_item')
li = [...li]
var switch_mode = document.querySelector('.switch_mode')
var drop_container = document.querySelector('.drop-container')
var add_edit = drop_container.parentNode
var edit_container = document.createElement('div')
var edit_container_inner = document.createElement('div')
edit_container.setAttribute('class','edit-container')
edit_container_inner.setAttribute('class','edit_inner')
edit_container.appendChild(edit_container_inner)

li.map(item=>{
  item.addEventListener('click',function(e){
    var target = e.currentTarget
    if(target.className === 'selected'){
      return
    }

    target.classList = target.className + ' selected'
    console.log(target.classList)

    drop_container.classList = drop_container.className + ' fadeOut_container'
    setTimeout(function(){
      console.log('remove')
      add_edit.removeChild(drop_container)
      edit_container.classList = edit_container.className + ' fadeIn_container'
      setTimeout(function(){
        console.log('add')
        add_edit.appendChild(edit_container)
      },200)
    },200)


    
  })
})