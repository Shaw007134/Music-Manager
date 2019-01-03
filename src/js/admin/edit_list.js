// function active_list(list,fileobj){
//   var list_item = document.querySelectorAll('.list_item')
//   list_item = [...list_item]
//   if(list.className.indexOf('active') == -1){
//     list_item.map(item=>{
//       if(item != list && item.className.indexOf('active') > -1){
//         item.classList.remove('active')
//       }
//     })
//     list.className += ' active'
//     // edit_list(list,fileobj)
//     console.log('active_list')

//   }
// }
function active_list(list,fileobj){
  remove_other(list,'active','list_item')
  window.eventHub.emit('editList',[list,fileobj])
}

{
  let view = {
    el: '.add_edit',
    init(){
      this.$el = document.querySelector(this.el)
    },
    render(data){
      let add_songlist = document.querySelector('.add_songlist')
      if(add_songlist.classList.contains('active')||this.$el.innerHTML===''){
        this.$el.innerHTML = ''
        add_songlist.classList.remove('active')
        let template = `<div class="add-edit-container fadeIn"><div class="edit_inner"><div class="edit_item"><label for="edit_name">歌单名: </label><input type="text" class="edit_input" id="edit_name" value=${data.title}></div><div class="edit_item"><label for="edit_owner">创建者: </label><input type="text" class="edit_input" id="edit_owner" value=${data.name}></div><div class="edit_textarea"><label for="summary">歌单简介: </label><textarea name="summary" class="textarea" id="summary" cols="30" rows="6">${data.summary}</textarea></div><div class="edit_button_container"><div class="edit_button">保存更改</div><div class="remove_button">删除歌单</div></div></div></div>`
        this.$el.insertAdjacentHTML('beforeend',template)
      }else{
        let edit_input = this.$el.querySelectorAll('.edit_input')
        let edit_textarea = this.$el.querySelector('.textarea')
        edit_input[0].value = data['title']
        edit_input[1].value = data['name']
        edit_textarea.value = data['summary']
      }
    }
  }
  let model = {
    data: {},
    init(fileobj){
      Object.assign(this.data,fileobj)
    },
    fetch(id){

    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEvents()
    },

    bindEvents(){
     

      window.eventHub.on('editList',([list,fileobj])=>{
        if(list === undefined) return
        this.model.init(fileobj)

        let id = this.model.data.id
        let songs = this.model.fetch(id)
        this.view.render(this.model.data)

        document.querySelector('.edit_button').outerHTML = document.querySelector('.edit_button').outerHTML
        document.querySelector('.remove_button').outerHTML = document.querySelector('.remove_button').outerHTML
        let edit_btn = document.querySelector('.edit_button')
        let remove_btn = document.querySelector('.remove_button')
        let edit_item = document.querySelectorAll('.edit_input')
        let edit_textarea = document.querySelector('.textarea')

        let item = AV.Object.createWithoutData('Playlist', id)

        function edit_listener(){
          item.set('title',edit_item[0].value)
          item.set('name',edit_item[1].value)
          item.set('summary',edit_textarea.value)
          item.save()

          list.querySelector('.songlist_title').innerHTML = edit_item[0].value
        }

        function remove_listener(){
          console.log(item)
          item.destroy().then(function (success) {
            console.log('remove done')
          }, function (error) {
            // 删除失败
          });

          list.classList.add('fadeOut')
          for(var i=0;i<edit_item.length;i++){
            edit_item[i].value = ''
          }
          edit_textarea.value = ''
          setTimeout(()=>{
            list.remove()
            var items = document.querySelectorAll('.list_item')
            for(var i=0; i<items.length; i++){
              items[i].firstChild.innerHTML = (i+1) + '.'
            }
          },500)
        }

        edit_btn.addEventListener('click',edit_listener)
        remove_btn.addEventListener('click',remove_listener)
      })
    }
  }
  controller.init(view,model)
}
