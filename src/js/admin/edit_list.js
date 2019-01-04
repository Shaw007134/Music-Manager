function active_list(list,fileobj){
  remove_other(list,'active','list_item')
  let query = new AV.Query('Playlist')
  query.get(fileobj.id).then((e)=>{
    var playlist = {"id":e.id}
    Object.assign(playlist,e.attributes)
    window.eventHub.emit('editList',[list,playlist])
  })
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
        let template = `<div class="add-edit-container fadeIn"><div class="edit_inner"><div class="edit_item"><label for="edit_name">歌单名: </label><input type="text" class="edit_input" id="edit_name" value=${data.title}></div><div class="edit_item"><label for="edit_owner">创建者: </label><input type="text" class="edit_input" id="edit_owner" value=${data.name}></div><div class="edit_item"><label for="edit_cover">封面: </label><input type="text" class="edit_input" id="edit_cover" value=${data.cover}></div><div class="edit_textarea"><label for="summary">歌单简介: </label><textarea name="summary" class="textarea" id="summary" cols="30" rows="3">${data.summary}</textarea></div>        <div class="edit_button_container"><div class="edit_button">保存更改</div><div class="remove_button">删除歌单</div></div></div><div class="upload-items"></div></div>`
        this.$el.insertAdjacentHTML('beforeend',template)
      }else{
        let items = document.querySelector('.upload-items')
        items.innerHTML = ''
        let edit_input = this.$el.querySelectorAll('.edit_input')
        let edit_textarea = this.$el.querySelector('.textarea')
        edit_input[0].value = data['title']
        edit_input[1].value = data['name']
        edit_input[2].value = data['cover']
        edit_textarea.value = data['summary']
        document.querySelector('.edit_button').outerHTML = document.querySelector('.edit_button').outerHTML
        document.querySelector('.remove_button').outerHTML = document.querySelector('.remove_button').outerHTML
      }

    }
  }
  let model = {
    data: {},
    init(fileobj){
      Object.assign(this.data,fileobj)
    },
    fetch(id,callback){
      let playlist = AV.Object.createWithoutData('Playlist', id)
      let query = new AV.Query('Song')
      query.find().then(function(objects){
        console.log(objects.length)
        callback.call()
        objects.map(object=>{
          console.log(object.attributes)
          let fileobj = {"id":object.id,"listid":id}
          let template 
          Object.assign(fileobj,object['attributes'])
          if(object.attributes.dependent && object.attributes.dependent.id === id){
            template = `<li class="upload-item"><div class="item-column"><div class="column-thumbnail"><img></div><div class="column-title"><div>${fileobj['title']}</div><span>${fileobj['singer']}</span></div><div class="column-action"><a><span class="success icon-jfi-check" id="action" title=""></span></a></div></div></li>`
          }else{
            template = `<li class="upload-item"><div class="item-column"><div class="column-thumbnail"><img></div><div class="column-title"><div>${fileobj['title']}</div><span>${fileobj['singer']}</span></div><div class="column-action"><a><span class="add icon-jfi-plus" id="action" title="Add to list"></span></a></div></div></li>`
          }
          function add_to_list(current_target,obj){
            let action = current_target.querySelector('#action')
            let song = AV.Object.createWithoutData('Song', obj.id)

            if(action.classList.contains('add')){
              song.set('dependent',playlist)
              action.className = 'success icon-jfi-check'
            }else if(action.classList.contains('success')){
              let list_temp = AV.Object.createWithoutData('Playlist','5c2ef5cc44d904005de78c91')
              song.set('dependent',list_temp)
              action.className = 'add icon-jfi-plus'
              
            }
            song.save().then((newsong)=>{
              console.log(newsong)
            },(error)=>{
              console.error(error)
            })
          }
          window.eventHub.emit('updateLists',[template,fileobj,'upload-items',add_to_list])
        })
        
      })
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
        // console.log(this.model.data)
        let id = this.model.data.id
        // this.view.render(this.model.data)
      
        let item = AV.Object.createWithoutData('Playlist', id)

        this.model.fetch(id,()=>{
          this.view.render(this.model.data)
          let edit_btn = document.querySelector('.edit_button')
          let remove_btn = document.querySelector('.remove_button')
          edit_btn.addEventListener('click',edit_listener)
          remove_btn.addEventListener('click',remove_listener)
          let edit_item = document.querySelectorAll('.edit_input')
          let edit_textarea = document.querySelector('.textarea')
  
  
          function edit_listener(){
            item.set('title',edit_item[0].value)
            item.set('name',edit_item[1].value)
            item.set('cover',edit_item[2].value)
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
            // for(var i=0;i<edit_item.length;i++){
            //   edit_item[i].value = ''
            // }
            // edit_textarea.value = ''
            let add_edit = document.querySelector('.add_edit')
            add_edit.innerHTML = ''
            setTimeout(()=>{
              list.remove()
              var items = document.querySelectorAll('.list_item')
              for(var i=0; i<items.length; i++){
                items[i].firstChild.innerHTML = (i+1) + '.'
              }
            },500)
          }
        })       
      })
    }
  }
  controller.init(view,model)
}
