{
  let view = {
    el: '#songlist_wrapper',
    template: `
    <li data-tjname="recom_songlist">
      <a href="./playlist?id={playlist.id}" class="list_main" data-href="">
        <div class="list_media clearfix">
          <img src={playlist.cover} alt="">
          <span class="listen_count"><i class="icon icon_listen"></i>67</span>
          <span class="icon icon_play"></span>
        </div>
        <div class="list_info">
          <h3 class="list_tit">{playlist.title}</h3>
          <p class="list_text">{playlist.name}</p>
        </div>
      </a>
    </li>
    `
    ,
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {lists} = data
      lists.map((list)=>{
        let $li = $(this.template
          .replace('{playlist.id}',list.id)
          .replace('{playlist.title}',list.title)
          .replace('{playlist.name}',list.name)
          .replace('{playlist.cover}',list.cover)
        )
        this.$el.append($li)
      })
    }
  }
  let model = {
    data: {
      lists: []
    },
    find(){
      var query = new AV.Query('Playlist')
      return query.find().then((objects)=>{
        this.data.lists = objects.map(object=>{
          if(object.id != '5c2ef5cc44d904005de78c91'){
            var fileobj = {"id":object.id}
            Object.assign(fileobj,object['attributes'])
            return fileobj
          }
        })
        return objects
      })
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      console.log('controller')
      this.view.init()
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}