
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
      console.log('load----'+load)
      if(!load){
        if(song.cover) {
          this.$el.find('.m-song-bg').css('background-image',`url(${song.cover})`)
          this.$el.find('img').attr('src',`${song.cover}`)
        }
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
      let audioPromise = this.play()
      console.log('render-----'+status)
      if (audioPromise != undefined) {
        audioPromise.then(()=>{
          if(status){
            this.$el.find('.m-song-plybtn').css('display','none')
            this.$el.find('.a-circling').removeClass('paused')
            this.play()
          }else{
            this.$el.find('.m-song-plybtn').css('display','block')
            this.$el.find('.a-circling').addClass('paused')
            this.pause()
          }
        },()=>{
          console.log('reject')
          this.$el.find('.m-song-plybtn').css('display','block')
          this.$el.find('.a-circling').addClass('paused')
          this.pause()
        })
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
      return this.$el.find('audio')[0].play()
      //chrome刷新会提示in promise DOM exception错误
    },
    pause(){
      return this.$el.find('audio')[0].pause()
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
      status: true,
      load: false,
    },

    get(id){
      var query = new AV.Query('Song')
      return query.get(id).then((object)=>{
        var song = {id:object.id}
        for (const key of Object.keys(object.attributes)){
          song[key] = object.attributes[key]
        }
        Object.assign(this.data.song,song)
        //return Object.assign({id: object.id},object.attributes)
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
      console.log('init')
      this.model.get(id).then(()=>{
        console.log(id)
        if(this.model.data.song['lyric']){
          $.getJSON(this.model.data.song['lyric'],
          (data)=>{
            console.log('lyric')
            this.model.data.song['lyric'] = data.tlyric.lyric
            this.view.render(this.model.data)
            this.model.data.load = true
          }
        )}else{
          this.view.render(this.model.data)
          this.model.data.load = true
        }
        
        this.view.$el.find('audio')[0].onended = ()=>{
          this.model.data.status = false
          console.log('audio onend')
          this.view.render(this.model.data)
        }
      })
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click','.m-song_newfst',()=>{
          console.log(this.model.data.status)
          this.model.data.status = !this.model.data.status
          this.view.render(this.model.data)
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

