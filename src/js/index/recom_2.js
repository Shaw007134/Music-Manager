{
  let view = {
    el: 'div.mod_song_list',
    template: `
      <a href="./song.html?id={song.id}" class="sgitem">
      <div class="item_container">
        <div class="title">{song.title}</div>
        <div class="singer"><i class="sq"></i>{song.singer}</div>
      </div>
      <div class="item_play"><div class="icon_play"></div></div>
    </a>
    `
    ,
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {songs} = data
      songs.map((song)=>{
        let $a = $(this.template
          .replace('{song.title}',song.title)
          .replace('{song.singer}',song.singer)
          .replace('{song.id}',song.id)
        )
        this.$el.find('div.sglst').append($a)
      })
    }
  }
  let model = {
    data: {
      songs: []
    },
    find(){
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