//require("Font8x16").add(Graphics);
const PI = Math.PI;

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
  var x = (hand.height/2-offX) * Math.sin(angle);
  var y = - (hand.height/2-offY) * Math.cos(angle);
  g.drawImage(hand, centerX+x, centerY+y, {rotate:angle});
}

function clearHand(hand, angle) {
  var buf = Graphics.createArrayBuffer(hand.width,hand.height,1);
  drawHand({width:buf.getWidth(),
                 height:buf.getHeight(),
                 buffer:buf.buffer,
                 bpp:1},angle);
}

function drawHour(hour, i) {
  var hourString = hour.toString();
  if(hourString == "13") hourString = "1";
  if(hourString == "0") hourString = "12";

  var x = (radius-4) * Math.sin(i/12 * 2*PI) + centerX;
  var y = - (radius-4) * Math.cos(i/12 * 2*PI) + centerY;
  g.setColor(palette[2]);
  g.setFont("6x8", 1);
  g.setFontAlign(0,0);
  g.drawString(hourString , x, y);
}

var handMin = imgMinute;//getHand(6, radius-30, true);
var handHour = imgHour;//getHand(8, radius-60, true);
var lastSecPoints = [];
var lastHour = -1;
var lastMin = -1;
function drawAnalog() {
  var date = Date(Date.now());
  var rotSec = date.getSeconds() * 2 * PI / 60;
  var rotMin = date.getMinutes() * 2 * PI / 60;
  var rotHour = (date.getHours() + 1/60*date.getMinutes()) * 2 * PI / 12;

  var hour = date.getHours() % 12;
//  if(hour == 0) {hour = 12;}
  if(initialDraw || lastHour != hour) {
    g.setColor(0);
    g.fillCircle(centerX, centerY, radius+5);
    for(var i = 0; i < 12; i++) {
      if(hour == i) {
        drawHour(hour, i);
      } else if((hour+1)%12 == i) {
        drawHour(hour+1, i);
      } else if(hour == 12 && i == 0) {
        drawHour(12, i);
      } else {
        g.setColor(palette[2]);
        drawTick(i/12.0 * 2*PI);
      }
    }
  }
  lastHour = hour;
  if(initialDraw || date.getMinutes() != lastMin) {
    g.setColor(0);
    g.fillCircle(centerX, centerY, handMin.height + 7);
  }
  lastMin = date.getMinutes();
//  g.fillCircle(centerX,centerY, radius-5);
  var points = rotateAndMove([0, -(radius-8)], rotSec, centerX, centerY);
  g.setColor(palette[0]);
  g.drawLine(centerX, centerY, lastSecPoints[0], lastSecPoints[1]);
  g.setColor(palette[2]);
  g.drawLine(centerX, centerY, points[0], points[1]);
  lastSecPoints = points;
  drawHand(handMin, rotMin, 3, 3);
  drawHand(handHour, rotHour, 4, 4);
  g.setColor(palette[1]);

  initialDraw = false;
}

function drawDigital() {
//  g.clear();
  var buf = Graphics.createArrayBuffer(238,180,2,{msb:true});

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
                 bpp:2},0,24);
  initialDraw = false;
}

function drawHello() {
  var buf = Graphics.createArrayBuffer(238,180,2,{msb:true});

  buf.setFontAlign(0,0);
  buf.setFont("6x8", 3);
  buf.setColor(3);
  buf.drawString("Hello World!", centerX,80);
  g.drawImage({width:buf.getWidth(),
               height:buf.getHeight(),
               buffer:buf.buffer,
               palette:palette,
               bpp:2},0,24);
  initialDraw = false;
}

function drawScreenIndicator(current, total) {
  for(var i = 0; i < total; i++) {
    if(i == current) {
      g.setColor(palette[2]);
      g.fillCircle(10 + 10 * i , 220, 3);
    } else {
      g.setColor(palette[1]);
      g.drawCircle(10 + 10* i , 220, 3);
    }
  }
}

var screen = 0;
var screens = [drawAnalog, drawDigital,drawHello];
var totalScreens = screens.length;
var draw = screens[0];

function clear() {
  g.clear();
  Bangle.drawWidgets();
  initialDraw = true;
}

function nextScreen(dir) {
  if (!Bangle.isLCDOn()) return; // ignore gesture when display is of
  if(timer) {
    clearInterval(timer);
    timer = null;
  }
  clear();
  if(dir == -1) {
    screen++;
    if(screen >= screens.length) { screen = 0;}
  } else {
    screen--;
    if(screen < 0) {screen = screens.length - 1;}
  }
  draw = screens[screen];
  timer = setInterval(draw, 1000);
  draw();
  drawScreenIndicator(screen, totalScreens);
}

var timer = null;
Bangle.on('lcdPower',function(on) {
   if(timer) {
     clearInterval(timer);
     timer = null;
   }
   if (on) {
     timer = setInterval(draw, 1000);
     draw();
     drawScreenIndicator(screen, totalScreens);
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
drawScreenIndicator(screen, totalScreens);
