{
  let view = {
    el: '.add_edit',
    template: `<div class="add-edit-container fadeIn"><div class="edit_inner"><div class="edit_item"><label for="edit_name">歌单名: </label><input type="text" class="edit_input" id="edit_name"></div><div class="edit_item"><label for="edit_owner">创建者: </label><input type="text" class="edit_input" id="edit_owner"></div><div class="edit_item"><label for="edit_cover">封面: </label><input type="text" class="edit_input" id="edit_cover"></div><div class="edit_textarea"><label for="summary">歌单简介: </label><textarea name="summary" class="textarea" id="summary" cols="30" rows="3"></textarea></div><div class="edit_button_container"><div class="edit_button">创建歌单</div></div></div><div class="upload-items"></div></div>`,
    init(){
      this.$el = document.querySelector(this.el)
    },
 
    render(){
      this.$el.insertAdjacentHTML('beforeend',this.template)
    }
  }
  let model = {
    data:{},
    create(data,callback){
      var Playlist = AV.Object.extend('Playlist')
      var playlist = new Playlist()

      for (const key of Object.keys(data)){
        playlist.set(key,data[key])
      }

      playlist.save().then((newlist)=>{
        callback(newlist)
      },(error)=>{
        console.error(error)
      })
    },
    
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    fetchAll(playlist){
      let query = new AV.Query('Song')
      console.log(playlist)
      query.find().then(function(objects){
        objects.map(object=>{
          var fileobj = {"id":object.id}
          Object.assign(fileobj,object['attributes'])
          function add_to_list(current_target,obj){
            let action = current_target.querySelector('#action')
            let song = AV.Object.createWithoutData('Song', obj.id)

            if(action.classList.contains('add')){
              song.set('dependent',playlist)
              action.className = 'success icon-jfi-check'
              action.addEventListener('mouseover',function(e){
                var i = e.currentTarget.className
                if(i.indexOf('success')!=-1){
                  e.currentTarget.setAttribute('title','Remove from list')
                  e.currentTarget.className = 'remove icon-jfi-times'
                }
              })
          
              action.addEventListener('mouseout',function(e){
                var i = e.currentTarget.className
                if(i.indexOf('remove')!=-1){
                  e.currentTarget.className = 'add icon-jfi-plus'
                  e.currentTarget.setAttribute('title','Add to list')
                }
              })
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
          let template = `<li class="upload-item"><div class="item-column"><div class="column-thumbnail"><img></div><div class="column-title"><div>${fileobj['title']}</div><span>${fileobj['singer']}</span></div><div class="column-action"><a><span class="add icon-jfi-plus" id="action" title="Add to list"></span></a></div></div></li>`
          window.eventHub.emit('updateLists',[template,fileobj,'upload-items',add_to_list])
        })
        
      })
    },
    bindEvents(){
      window.eventHub.on('add_songlist',()=>{
        this.view.render()
        let submit = this.view.$el.querySelector('.edit_button')
        submit.addEventListener('click',()=>{
          let edit_input = this.view.$el.querySelectorAll('.edit_input')
          let edit_textarea = this.view.$el.querySelector('.textarea')
          let list = {
            "title": edit_input[0].value,
            "name": edit_input[1].value,
            "cover": edit_input[2].value,
            "summary": edit_textarea.value,
          }
          this.model.create(list,(e)=>{
            this.model.data.id = e.id
            Object.assign(this.model.data,e.attributes)
            window.eventHub.emit('updateLists',['list_item',this.model.data,'song_lists',active_list])
            // this.fetchAll(e)
            let lists = document.querySelectorAll('.list_item')
            let newlist = lists[lists.length-1]
            active_list(newlist,e)
          })
          window.alert("歌单："+edit_input[0].value+" 创建成功")
          // edit_input[0].value = ''
          // edit_input[1].value = ''
          // edit_textarea.value = ''
          
        })
      })
    }
  }
  controller.init(view,model)
}