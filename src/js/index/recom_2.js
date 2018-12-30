{
  let view = {
    el: 'div.mod_song_list',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      console.log('render')
      let {songs} = data
      console.log(songs)
      
      songs.map((song)=>{
        console.log(song)
        let $a = $(`
          <a href="" class="sgitem">
            <div class="item_container">
              <div class="title">${song.title}</div>
              <div class="singer"><i class="sq"></i>${song.singer}</div>
            </div>
            <div class="item_play"><div class="icon_play"></div></div>
          </a>
        `)
        console.log(1)
        this.$el.find('div.sglst').append($a)
      })
    }
  }
  let model = {
    data: {
      songs: []
    },
    find(){
      var APP_ID = 'vQLSvBdTgnXTooYhaS52sJeg-gzGzoHsz';
      var APP_KEY = 'Xj9qAEQtQyM9bfc52opYGDKN';

      AV.init({
        appId: APP_ID,
        appKey: APP_KEY
      });
      var query = new AV.Query('Song')
      return query.find().then((objects)=>{
        this.data.songs = objects.map(object=>{
          return {id: object.id, ...object.attributes}
        })
        return objects
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}