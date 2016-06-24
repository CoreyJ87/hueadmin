$(document).ready(function({

  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: 'http://localhost:3000/getlightinfo',
    success: function(data) {
      console.log('success');
      console.log(JSON.stringify(data));
    }
  });

  $("#flat").spectrum({
    flat: true,
    showInput: true
  });

  $("#flat").on("dragstop.spectrum", function(e, color) {
    var data=convertColorValues(color.toHsv());
    data.hue = hue;
    data.saturation = saturation;
    data.brightness=brightness;
    data.id=1;
    data.enabled=true
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/savelight',
      success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
      }
    });
  });
});


function convertColorValues(hsv){
  var data={};
  data.hue = Math.floor(hsv.h/360*65536);
  data.saturation=Math.floor(hsv.s*254);
  data.brightness=Math.floor(hsv.v*254);
  console.log("Hue:"+data.hue);
  console.log("Saturation:"+data.saturation);
  console.log("Brightness:"+data.brightness);
  return data;
}
