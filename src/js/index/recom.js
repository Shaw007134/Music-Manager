{
  let view = {
    el : '.recom_wrap',
    init(){
      this.$el = $(this.el)
    },
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEventHub()
      this.loadSong()
      this.loadSonglist()
    },
    bindEventHub(){
      window.eventHub.on('selectNav',(navName)=>{
        if(navName === 'recom_wrap'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    loadSong(){
      let recom = document.createElement('script')
      recom.src = './src/js/index/recom_song.js'
      recom.onload = function() {
        console.log('recom loaded')
      }
      document.body.appendChild(recom)
    },
    loadSonglist(){
        let recomList = document.createElement('script')
        recomList.src = './src/js/index/recom_list.js'
        recomList.onload = function() {
          console.log('recomList loaded')
        }
        document.body.appendChild(recomList)
    }
  }
  controller.init(view,model)
}