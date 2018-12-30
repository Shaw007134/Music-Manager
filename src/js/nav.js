{
  let view = {
    el: '#nav',
    init(){
      this.$el = $(this.el)
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click','a',(e)=>{
        let $a = $(e.currentTarget)
        let pageName = $a.attr('data-nav')
        $a.addClass('current')
          .siblings().removeClass('current')
        window.eventHub.emit('selectNav',pageName)
      })
    }
  }
  controller.init(view,model)
}