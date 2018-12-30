var playOptions = {
  containerID: 'slides-container',
  slides: 'slides',
  buttons: 'slides-buttons',
  prev: 'slides-prev',
  next: 'slides-next',
  timer: null
};

window.onload = function() {
  var slides = document.getElementById('slides')
  var slide = slides.querySelectorAll('#slide')
  var firstCopy = slide[0].cloneNode(true)
  var lastCopy = slide[slide.length-1].cloneNode(true)
  slides.insertBefore(lastCopy,slides.firstChild)
  slides.appendChild(firstCopy)
  carousel(playOptions, 2000);
};

window.onresize = function() {
    clearInterval(playOptions.timer);
    carousel(playOptions, 2000);
};



var current = 0


function carousel(option, interval) {
  var $ = function(ele) {
      return document.getElementById(ele);
  };
  var slides_container = $(option.containerID);
  var slides = $(option.slides),
    slides_buttons = $(option.buttons),
    slides_prev = $(option.prev),
    slides_next = $(option.next);

  var animated = false
      // index = 1;
  
  var img = slides.getElementsByTagName('img'),
      len = img.length;

  var width,
      height;

  function responseInit() {
    width = slides_container.offsetWidth;
    height = parseInt((img[0].height));
    // 宽度随视窗自适应
    slides.style.left = -width + 'px';
    slides.style.width = width * img.length + 'px';
    // 高度随图片自适应
    slides_container.style.height = height + 'px';
    slides.style.height = height + 'px';
    for (var i = 0; i < img.length; i++) {
      img[i].style.width = parseInt(width) + 'px';
    }
  }
  responseInit();
  
  var size = parseInt(len - 2);
  var btns = document.createDocumentFragment();
  for (var i = 0; i < size; i++) {
    var span = document.createElement('span');
    span.setAttribute('index', i);
    if (i == 0) {
      span.className = 'on';
    }
    btns.appendChild(span);
  }
  slides_buttons.innerHTML = '';
  slides_buttons.appendChild(btns);
  slides_prev.onclick = function() {
    if (!animated) {
      animate(current-1);
    }
  }

  slides_next.onclick = function() {
    if (!animated) {
      animate(current+1);
    }
  };

  function animate(index) {
    animated = true;
    if(index > size-1){
      index = 0
    }else if(index < 0){
      index = size-1
    }
   
    function resetImg(index) {
      animated = true;
      slides.style.left = -(width * index) + 'px';
      slides.style.transition = 'all 0s';
      // slides.offset()
      animated = false;
    }
    function go() {
      animated = false;
      offset = (current - index) * width
      var newLeft = parseInt(slides.style.left) + offset;

      if (current === 0 && index === size-1) {
        newLeft = parseInt(slides.style.left) + width
        slides.style.left = newLeft + 'px';
        setTimeout(function() {
          resetImg(size);
        }, 1500);
      }
      else if (current === size-1 && index === 0) {
        newLeft = parseInt(slides.style.left) - width
        setTimeout(function() {
          resetImg(1);
        }, 1500);
      }

      slides.style.transition = 'all 1s';
      slides.style.left = newLeft + 'px';
      current = index
      showButtons(index)
    }
    go();
  }
  var btn =slides_buttons.getElementsByTagName('span');

  function showButtons(index) {
    for (var i = 0; i < btn.length; i++) {
      btn[i].className = '';
    }
    btn[index].className = 'on';
  }

  for (var i = 0; i < btn.length; i++) {
    btn[i].onclick = function() {
      if (this.className === 'on') {
        return;
      }
      var clickIndex = parseInt(this.getAttribute('index'));
      if (!animated) {
        animate(clickIndex);
      }
    };
  }

  function play() {
    option.timer = setInterval(function() {
      animate(current+1)
    }, interval);
  }

  

  function stop() {
    clearInterval(option.timer);
    console.log('轮播暂停')
  }
  play();

  slides_container.onmouseover = stop;

  slides_container.onmouseout = play;

  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      stop();
    }else{
      play();
    }
  })

  window.eventHub.on('selectNav',(navName)=>{
    if(navName === 'recom_wrap'){
      play()
    }else{
      stop()
    }
  })

  function resizeListener(){
    responseInit();
  }
  window.addEventListener('resize', resizeListener, false);
}