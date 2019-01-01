
{
  let view = {
    el:'.m-newsong',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {song,status,load} = data
      console.log(load)
      if(!load){
        console.log('load: '+load)
        this.$el.find('.m-song-bg').css('background-image',`url(${song.cover})`)
        this.$el.find('img').attr('src',`${song.cover}`)
        this.$el.find('.m-song-clickarea').html(`<audio src=${song.url} autoplay></audio>`)
      }
      if(status === 'paused'){
        this.$el.find('.m-song-plybtn').css('display','block')
        this.$el.find('.a-circling').addClass('paused')
        console.log('pause')
        this.pause()
      }else{
        this.$el.find('.m-song-plybtn').css('display','none')
        this.$el.find('.a-circling').removeClass('paused')
        console.log('play')
        this.play()
      }
    },
    play(){
      this.$el.find('audio')[0].play()
    },
    pause(){
      this.$el.find('audio')[0].pause()
    }
  }

  let model = {
    data: {
      song: {
        id: '',
        title: '',
        singer: '',
        url: '',
        cover: ''
      },
      status: '',
      load: false
    },

    get(id){
      var query = new AV.Query('Song')
      return query.get(id).then((object)=>{
        Object.assign(this.data.song,{id:object.id,...object.attributes})
        return object
      })
    }
  }

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then(()=>{
        this.view.render(this.model.data)
        this.model.data.load = true
      })
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click','.m-song_newfst',()=>{
        if(this.model.data.status === ''){
          this.model.data.status = 'paused'
          this.view.render(this.model.data)
        }else{
          this.model.data.status = ''
          this.view.render(this.model.data)
        }
      })
    },
    getSongId(){
      let search = window.location.search
      if(search.indexOf('?') === 0){
        search = search.substring(1)
      }

      let array = search.split('&').filter((v=>v))
      let id = ''

      for(let i=0; i<array.length; i++){
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if(key === 'id'){
          id = value
          break
        }
      }
      return id
    },
    
  }
  controller.init(view,model)
}

