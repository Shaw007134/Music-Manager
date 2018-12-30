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
      this.loadModule1()
      this.loadModule2()
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
    loadModule1(){
      let recom1 = document.createElement('script')
      recom1.src = './src/js/index/recom_1.js'
      recom1.onload = function() {
        console.log('recom1 loaded')
      }
      document.body.appendChild(recom1)
    },
    loadModule2(){
      let recom2 = document.createElement('script')
      recom2.src = './src/js/index/recom_2.js'
      recom2.onload = function() {
        console.log('recom2 loaded')
      }
      document.body.appendChild(recom2)
    }
  }
  controller.init(view,model)
}