$(document).ready(function(){

  //Blink buttons
  $('#blink').on('click','.blink-btn',function(){
    var data = {};
    var lightid = $(this).attr('id').split('_')[1];
    data.id=lightid;

    data.on=true;
    if($('#blinkType input:checked').attr('id') == "blinkonce"){
      data.alert="select";
    }
    else {
      data.alert="lselect";
    }
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/savelight',
      success: function(data) {
        console.log(JSON.stringify(data));
      }
    });
  });

  //Delete user buttons
  $('#userList').on('click','.userdelete-btn',function(){
    var data = {};
    var deleteUser = $(this).attr('id');
    data.deletedUser=deleteUser;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/deleteUser',
      success: function(data) {
        console.log(JSON.stringify(data));
        $('#'+data.deletedUser).parents('.row').hide(1000);
      }
    });
  });

  //On off buttons
  $('#onoff').on('click','.onoff-btn',function(){
    var data = {};
    var lightid = $(this).attr('id').split('_')[1];
    var state = ($(this).hasClass('lightOn')) ? true : false;
    data.id=lightid;
    data.on=!state;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/savelight',
      success: function(data) {
        console.log(JSON.stringify(data));
        $('#onoff_'+data.lightid).toggleClass('lightOn').toggleClass('lightOff').toggleClass('btn-danger').toggleClass('btn-success');
      }
    });
  });
  //Color picker
  $("#flat").spectrum({
    flat: true,
    showInput: true,
    change: function(color) {
      var data=convertColorValues(color.toHsv());
      console.log(color.toHsv())
      var activeLight = getLightButtonState();
      for(var x = 0;x<=activeLight.length;x++){
        data.id=activeLight[x];
        data.enabled=true;
        data.colorMode="hs";
        $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: 'http://localhost:3000/savelight',
          success: function(data) {
            console.log(JSON.stringify(data));
          }
        });
      }
    }
  });
})

function convertColorValues(hsv){
  var data={};
  data.hue = Math.ceil(hsv.h/360*65536);
  data.saturation=Math.ceil(hsv.s*254);
  data.brightness=Math.ceil(hsv.v*254);
  console.log("Hue:"+data.hue);
  console.log("Saturation:"+data.saturation);
  console.log("Brightness:"+data.brightness);
  return data;
}

function getLightButtonState(){
  var activeLights = [];
  $('#lights label').each(function(){
    if($(this).hasClass('active')){
      activeLights.push($(this).attr('id').split('_')[1])
    }
  });
  return activeLights;
}
