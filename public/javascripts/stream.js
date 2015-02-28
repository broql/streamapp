(function () {

  window.addEventListener('DOMContentLoaded', streamApp);

  function streamApp() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    if (!(video && canvas)) {
      return
    }

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    var isStreaming = false;
    var w = 600;
    var h = 420;

    var play = document.getElementById('play');
    var stop = document.getElementById('stop');
    var ctx = canvas.getContext('2d');

    video.addEventListener('play', function (e, data) {
      setInterval(function () {
        ctx.drawImage(video, 0, 0);
        //console.log('image', canvas.toDataURL('image/webp'));
      }, 33);
    }, false);

    // Wait until the video stream can play
    video.addEventListener('canplay', function (e) {
      if (!isStreaming) {
        // videoWidth isn't always set correctly in all browsers
        if (video.videoWidth > 0) h = video.videoHeight / (video.videoWidth / w);
        canvas.setAttribute('width', w);
        canvas.setAttribute('height', h);
        video.setAttribute('width', w);
        video.setAttribute('height', h);
        isStreaming = true;
      }
    }, false);

    play.addEventListener('click', function (e) {
      video.play();
    }, false);

    stop.addEventListener('click', function (e) {
      video.pause();
    }, false);

    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true}, function (stream) {
        video.src = window.URL.createObjectURL(stream);
      }, function (error) {
        alert('Something went wrong. (error code ' + error.code + ')');
        return;
      });
    }
  }

})();
