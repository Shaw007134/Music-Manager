{
  let view = {
    el: '.wrap',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let list = data
      console.log(list.songs)
      this.$el.find('.list_title').text(list.title)
      this.$el.find('.list_name').text(list.name)
      this.$el.find('.l3').text("简介: "+list.summary)
      this.$el.find('.top_bg').css('background-image',`url(${list.cover})`)
      this.$el.find('.top_inner>img').attr('src',`${list.cover}`) 
      let template
      let i = 0
      // var songs = list.songs
      // console.log()
      list.songs.forEach((song)=>{
        console.log(song)
        i = i+1
        template = `
        <a href="./song.html?id=${song.id}" class="sgitem">
          <div class="no">${i}.</div>
          <div class="item_container">
            <div class="title">${song.title}</div>
            <div class="singer">${song.singer}</div>
          </div>
          <div class="item_play"><div class="icon_play"></div></div>
        </a>
        `
        var parent = document.querySelector('.u-songs')
        parent.insertAdjacentHTML('beforeend',template)
      })
    
    }
  }
  let model = {
    data: {
      list: {},
    },
    get(id){
      var query = new AV.Query('Playlist')
      return query.get(id).then((obj)=>{
        console.log(obj)
        this.data.list.id = id
        Object.assign(this.data.list,obj.attributes)
        return obj
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      let id = this.getListId()
      console.log(id)
      this.model.get(id).then(()=>{
        var Playlist = AV.Object.createWithoutData('Playlist', id);
        var query = new AV.Query('Song');
        query.equalTo('dependent', Playlist);
        
        query.find().then((objects)=> {
          this.model.data.list.songs = objects.map((obj)=>{
            let song = {"id":obj.id}
            Object.assign(song,obj.attributes)
            return song
          })
          this.view.render(this.model.data.list)
            // songs.forEach((song)=> {
            //     console.log(song);
            // });
        });
        //获得列表中所有歌曲id，然后render 视图
      })
    },
   
    getListId(){
      let search = window.location.search
      if(search.indexOf('?') === 0){
        search = search.substring(1)
      }
      let array = search.split('&').filter((v=>v))
      let id = ''
      for(let i=0;i<array.length;i++){
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if(key === 'id'){
          id = value
          break
        }
      }
      return id
    }
  }
  controller.init(view,model)
}