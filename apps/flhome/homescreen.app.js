//require("Font8x16").add(Graphics);
const PI = Math.acos(0) * 2;

var centerX = 239 / 2;
var centerY = (239-23)/2 + 24;

var radius = 100;

var initialDraw = true;

function rotateAndMove(points, angle, dx, dy) {
  for(var i = 0; i < points.length; i += 2) {
  	  var x = points[i] * Math.cos(angle) - points[i+1] * Math.sin(angle) + dx;
  	  points[i+1] = points[i] * Math.sin(angle) + points[i+1] * Math.cos(angle) + dy;
      points[i] = x;
  }
  return points;
}

function getHand(handWidth, handLength, fill) {
  var buf = Graphics.createArrayBuffer(12,handLength,8,{msb:true});

  var startX = buf.getWidth()/2.0;
  var startY = 0;

  var gutX = (buf.getWidth() - handWidth)/2;
  var gutY = handLength * 0.2;

  var tipX = buf.getWidth() / 2.0;
  var tipY = handLength;

  var backX = buf.getWidth/2 + handWidth / 2;
  var backY = handLength * 0.2;

//  var points = [startX, startY, gutX, gutY, tipX, tipY, backX, backY];
  var points = [startX, startY, startX, gutY, startX, tipY, startX, backY];
  if(fill) {
    buf.setColor(2);
    buf.fillPoly(points, true);
    buf.setColor(3);
    buf.drawPoly(points, true);
  } else {
    buf.setColor(3);
    buf.drawPoly(points, true);
  }
//  buf.setColor(1);
//  buf.fillCircle(buf.getWidth()/2, buf.getHeight()-buf.getWidth()/2, buf.getWidth()/2);
  return {
    width : buf.getWidth(), height : buf.getHeight(), bpp : 8,
    palette: palette,
    transparent: 0,
    buffer : buf.buffer};
}

var imgMinute = {
  width : 6, height : 83, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("AAMrlYFDq1WAreBwIFVw4FExGIAoesAousAsErAoJyCqw1BLQWBrtdIQWsMoIYCCoIZBDgQIDqwUCwIEBEAQEBFgYyCgwFBg5KNCIUGAoMxAoMxAoNdAoNdIoOyIIOyq0r65TB64zB1my2QnCBgIKCGQ6nuAtKeCa5AFMQYIFQEaAFTSv4FLeooFFwOBAYI="))
};

var imgHour = {
  width : 8, height : 49, bpp : 8,
  transparent : 254,
  buffer : require("heatshrink").decompress(atob("AAWs64HN2QHG64HIlYHGqwGDlfX2eBA4dW6+y1gHDwOy2WzDwmyw4wDDwNdqwgD1myGoOICAIOBrgLBmPXwIOBgwcCEIIODCAfXmJTE2YHGOYOHAwdc66EBrpaCQQQhBw9dAwJ5CCIKAGQ5KPMA5KXFOIOyT5uzU5GycwgGBbAgHJxwHEBwIHNC44HRH5pXGleHx2O2UHAwgABw8HroGDAANdxAHFxAHHC48rCAmIZIIwDw4GBA="))
};

// gelb var palette = new Uint16Array([0, 0x4A41, 0xFFE5, 0xFFFF]);
// gruen var palette = new Uint16Array([0, 0x0B07, 0x1752, 0xFFFF]);
// blau var palette = new Uint16Array([0, 0x336D, 0x6FFF, 0xFFFF]);
var palette = new Uint16Array([0, 0x0B07, 0xA757, 0xFFFF]);

function drawTick(angle) {
  var points = [0, radius-5, 0, radius];
  points = rotateAndMove(points, angle - PI, centerX, centerY);
  g.drawLine(points[0], points[1], points[2], points[3]);
}

function drawHand(hand, angle, offX, offY) {
  var x = (hand.height/2) * Math.sin(angle) - offX;
  var y = - (hand.height/2) * Math.cos(angle) - offY;
  g.drawImage(hand, centerX+x, centerY+y, {rotate:angle});
}

function clearHand(hand, angle) {
  var buf = Graphics.createArrayBuffer(hand.width,hand.height,1);
  drawHand({width:buf.getWidth(),
                 height:buf.getHeight(),
                 buffer:buf.buffer,
                 bpp:1},angle);
}

var handSec = getHand(2, radius-20, true);
var handMin = imgMinute;//getHand(6, radius-30, true);
var handHour = imgHour;//getHand(8, radius-60, true);
var lastAngle = {"sec" : 0, "min": 0, "hour": 0};
var lastHour = -1;
function drawAnalog() {
  var date = Date(Date.now());
  var rotSec = date.getSeconds() * 2 * PI / 60;
  var rotMin = date.getMinutes() * 2 * PI / 60;
  var rotHour = (date.getHours() + 1/60*date.getMinutes()) * 2 * PI / 12;
  //g.clear();
  //g.drawString(process.memory().free.toString(), 40, 10);
  //g.drawString(process.memory().free.toString(), 40, 10);
  //g.setColor(palette[3]);
  if(initialDraw || lastHour != date.getHours()) {
    g.setColor(0);
    g.fillCircle(centerX, centerY, radius);
    for(var i = 0; i < 12; i++) {
      if(date.getHours() % 12 == i) {
        var x = (radius) * Math.sin(i/12 * 2*PI) + centerX;
        var y = - (radius) * Math.cos(i/12 * 2*PI) + centerY;
        g.setColor(palette[2]);
        g.setFont("6x8", 1);
        g.setFontAlign(0,0);
        g.drawString(date.getHours().toString(), x, y);
        //drawTick(i/12.0 * 2*PI);
      } else {
        g.setColor(palette[2]);
        drawTick(i/12.0 * 2*PI);
      }
    }
  }
  lastHour = date.getHours();
  //g.drawCircle(centerX, centerY, radius);
//  clearHand(handSec, lastAngle.sec);
//  clearHand(handMin, lastAngle.min);
//  clearHand(handHour, lastAngle.hour);
  g.setColor(0);
  g.fillCircle(centerX,centerY, radius-5);
  g.setColor(palette[3]);
  var points = rotateAndMove([0, radius-8], rotSec, centerX, centerY);
  g.drawLine(centerX, centerY, points[0], points[1]);
//  drawHand(handSec, rotSec, 0, 0);
  drawHand(handMin, rotMin, 0, 0);
  drawHand(handHour, rotHour, 2, 4);
  g.setColor(palette[1]);
//  g.drawCircle(centerX, centerY, 8);
//  lastAngle.sec = rotSec;
//  lastAngle.min = rotMin;
//  lastAngle.hour = rotHour;
  initialDraw = false;
}

function drawDigital() {
//  g.clear();
  var buf = Graphics.createArrayBuffer(238,239-23,2,{msb:true});

  buf.setFontAlign(0,0);
  buf.setFont("6x8", 4);
  var curDate = Date(Date.now());
  var hours = ('00' + curDate.getHours()).slice(-2);
  var minutes = ('00' + curDate.getMinutes()).slice(-2);
  var seconds = ('00' + curDate.getSeconds()).slice(-2);
  buf.setColor(3);
  buf.drawString(hours + ":" + minutes + ":" + seconds, centerX,80);

  buf.setFont("6x8", 2);
  var year = '' + curDate.getFullYear();
  var month = ('00' + (curDate.getMonth() + 1)).slice(-2);
  var day = ('00' + curDate.getDate()).slice(-2);
  buf.setColor(2);
  buf.drawString(day + "." + month + "." + year, centerX, 120);
    g.drawImage({width:buf.getWidth(),
                 height:buf.getHeight(),
                 buffer:buf.buffer,
                 palette:palette,
                 bpp:2},0,23);
  initialDraw = false;
}

var screen = 0;
var draw = drawAnalog;

function clear() {
  //g.setColor(0);
  //g.fillRect(0,23, 239, 239);
  g.clear();
  Bangle.drawWidgets();
  initialDraw = true;
}

function nextScreen(dir) {
  if(timer) {
    clearInterval(timer);
  }
  clear();
  if(screen == 0) {
    screen++;
    draw = drawDigital;
     timer = setInterval(draw, 1000);
  } else if (screen == 1) {
    screen = 0;
    draw = drawAnalog;
    timer = setInterval(draw, 1000);
  }
  draw();
}

var timer = null;
Bangle.on('lcdPower',function(on) {
   if (on) {
     timer = setInterval(draw, 1000);
     draw();
   } else {
     if(timer) {
       clearInterval(timer);
     }
   }
});

//dir left = -1, right = 1
Bangle.on('swipe', function(dir) {
  nextScreen(dir);
});

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
//g.drawString("Hier stehe die Widgets", 0, 0);

timer = setInterval(draw, 1000);
draw();
