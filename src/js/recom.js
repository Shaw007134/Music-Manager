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
      this.bindEventHub({})
    },
    bindEventHub(){
      window.eventHub.on('selectNav',(navName)=>{
        if(navName === 'recom_wrap'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }
  }
  controller.init(view,model)
}