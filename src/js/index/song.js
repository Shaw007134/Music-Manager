
{
  let view = {
    el:'.m-newsong',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {song,status,load} = data
      this.$el.find('.m-song-sname').text(song.title)
      this.$el.find('.m-song-autr').text(song.singer)
      if(!load){
        this.$el.find('.m-song-bg').css('background-image',`url(${song.cover})`)
        this.$el.find('img').attr('src',`${song.cover}`)
        this.$el.find('.m-song-clickarea').html(`<audio src=${song.url}></audio>`)
        let lyrics = song.lyric.split('\n')
        let lyrics_inner = this.$el.find('.m-song-inner')
        let regex = /\[([\d.:]+)\](.+)/
        for(var i=0;i<lyrics.length;i++){
          // console.log(lyrics[i])
          let result = lyrics[i].match(regex)
          if(result){
            if(result[2]) {
              let minutes = result[1].split(':')[0]
              let seconds = result[1].split(':')[1]
              let time = parseInt(minutes,10)*60 + parseFloat(seconds,10)
              lyrics_inner.append(`<p class='m-song-lritem' data-time=${time}>${result[2]}</p>`)
            }
          }
        }
        let audio = this.$el.find('audio')[0]
        audio.ontimeupdate = ()=>{
          this.showLyric(audio.currentTime)
        } 
      }
      if(status === 'paused'){
        this.$el.find('.m-song-plybtn').css('display','block')
        this.$el.find('.a-circling').addClass('paused')
        this.pause()
      }else{
        this.$el.find('.m-song-plybtn').css('display','none')
        this.$el.find('.a-circling').removeClass('paused')
        this.play()
      }
    },
    showLyric(time){
      let allP = this.$el.find('.m-song-lritem')
      let previousTime = 0
      let p
      for(let i=0;i<allP.length;i++){
        let nextTime = allP.eq(i).attr('data-time')
        if(time < nextTime && time > previousTime){
          p = allP[i]
          let pHeight = p.getBoundingClientRect().top
          let song_inner = this.$el.find('.m-song-inner')
          let lineHeight = song_inner[0].getBoundingClientRect().top
          console.log(allP[1].getBoundingClientRect().top-allP[0].getBoundingClientRect().top)
          console.log(pHeight-lineHeight)
          song_inner.css({
            transform: `translateY(${-pHeight+lineHeight+24}px)`
          })
          $(p).addClass('active')
            // .siblings('.active').removeClass('active')
          break
        }
        previousTime = nextTime
      }
    },
    play(){
      this.$el.find('audio')[0].play()
      //chrome刷新会提示in promise DOM exception错误
    },
    pause(){
      this.$el.find('audio')[0].pause()
    },
  }

  let model = {
    data: {
      song: {
        id: '',
        title: '',
        singer: '',
        url: '',
        cover: '',
        lyric: ''
      },
      status: '',
      load: false
    },

    get(id){
      var query = new AV.Query('Song')
      return query.get(id).then((object)=>{
        var song = {id:object.id}
        for (const key of Object.keys(object.attributes)){
          song[key] = object.attributes[key]
        }
        Object.assign(this.data.song,song)
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
        $.getJSON(this.model.data.song['lyric'],
          (data)=>{
            this.model.data.song['lyric'] = data.tlyric.lyric
            this.view.render(this.model.data)
            this.model.data.load = true
          }
        )
        this.view.$el.find('audio')[0].onended = ()=>{
          this.model.data.status = 'paused'
          this.view.render(this.model.data)
        }
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

