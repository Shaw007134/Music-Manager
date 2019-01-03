{
  let view = {
    el: '.add_edit',
    template: `<div class="add-edit-container fadeIn"><div class="edit_inner"><div class="edit_item"><label for="edit_name">歌单名: </label><input type="text" class="edit_input" id="edit_name"></div><div class="edit_item"><label for="edit_owner">创建者: </label><input type="text" class="edit_input" id="edit_owner"></div><div class="edit_textarea"><label for="summary">歌单简介: </label><textarea name="summary" class="textarea" id="summary" cols="30" rows="6"></textarea></div><div class="edit_button_container"><div class="edit_button">保存提交</div></div></div></div>`,
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
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents(){
      window.eventHub.on('add_song',()=>{
        this.view.render()
        let submit = this.view.$el.querySelector('.edit_button')
        submit.addEventListener('click',()=>{
          let edit_input = this.view.$el.querySelectorAll('.edit_input')
          let edit_textarea = this.view.$el.querySelector('.textarea')
          let list = {
            "title": edit_input[0].value,
            "name": edit_input[1].value,
            "summary": edit_textarea.value,
          }
          this.model.create(list,(e)=>{
            console.log(e.id)
            this.model.data.id = e.id
            Object.assign(this.model.data,e.attributes)
            console.log(this.model.data)
            window.eventHub.emit('updateLists',['list_item',this.model.data,'song_lists',active_list])
          })
          window.alert("歌单："+edit_input[0].value+"创建成功")
          edit_input[0].value = ''
          edit_input[1].value = ''
          edit_textarea.value = ''
        })
      })
    }
  }
  controller.init(view,model)
}