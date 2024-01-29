
var _drawingTool = null;

$(window).load(function() {

  AddCallbackEvent('onItemEnd', saveState);
  window.setTimeout(function() { 
    //1. Get translation for "OK" button
    var ok = "OK";
    var js_translation = {};
    var path_unit = getControler().GetModuleUrl() + "/../unit";
    $.ajax({
      type: "GET",
      url: path_unit + "/XYZ/TestFlow18/" + getLang() + "/js_translation.js",
      async: false,
      dataType: "text",
      success: function(txt) {
        var RE = /(js_translation\['ok'\])(\s*)(={1})(\s*)(['"]{1})([^'"]+)(['"]{1})/gi
        var result = txt.match(RE);
        if(result != null){
          eval(result[0]); // add to js_tranlation via eval
          ok  = $("<div/>").html(js_translation["ok"]).text(); // "clean"
        }
      }
    });

    //2. Add styling for dialog
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(".alertWrap {text-align: center;}"));

    //3. Create dialog element wrapping the alert text
    $('.javascriptalert').wrap("<dialog class='alertWrap'></dialog>").wrap("<form method='dialog'></form>");
    $('.alertWrap form').append("<br/><button id='confirmBtn' value='default'>" + ok + "</button>");
    $('.javascriptalert').show();

    //4. Display the alert dialog
    document.querySelector('.alertWrap').showModal();
  //window.alert($('.javascriptalert').text()); 
}, 420000);

  if (document.dir === 'rtl') {
    var style = {
      '-moz-transform': 'scale(-1, 1)',
      '-webkit-transform': 'scale(-1, 1)',
      '-o-transform': 'scale(-1, 1)',
      'transform': 'scale(-1, 1)',
      'filter': 'FlipH',
    };
    $('img[src="image/stamp.png"]').css(style);
    $('img[src="image/all.png"]').css(style);
  }

  var drawingTool = new DrawingTool("#drawing-tool01", {
      stamps: {
        _: [
          'image/svg/person-b.svg',
          'image/svg/person-w.svg',
          'image/svg/tree-b.svg',
          'image/svg/tree-w.svg'
        ]},
      width: 500,
      height: 550
      //backgroundImage: "image/hat_background.png",
    });
    _drawingTool = drawingTool;
});

function saveState() {
  _drawingTool.clearSelection();
  setUserVar('T540_DT_1_description', $('#T540Q01TXT1').val());
  setUserVar('T540_DT_1', _drawingTool.save());
  setUserVar('T540_DT_1_image', _drawingTool.canvas.toDataURL('image/png'));
  RemoveCallback('onItemEnd', saveState);
}

function getFTEData(formatted) {
  var state = _drawingTool.save();
  if (formatted) {
    _drawingTool.clearSelection();
    return '<img id="T540_DT_image_1" src="' + _drawingTool.canvas.toDataURL('image/png') + '"/>';
  } else {
    return state;
  }
}

function setFTEData(state) {
  _drawingTool.load(state);
}