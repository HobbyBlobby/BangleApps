var locale = require("locale");
// Offscreen buffer
var buf = Graphics.createArrayBuffer(200,210,1,{msb:true});

var width = 200;
var height = 200;

var colR = 0.9;
var colG = 1.0;
var colB = 0.9;

function flip() {
  g.setColor(colR, colG, colB);
  g.drawImage({width:buf.getWidth(),height:buf.getHeight(),buffer:buf.buffer},20,30);
}

//###### ANALOG CLOCK
var PI = Math.acos(0) * 2;

function moveBy(points, dx, dy) {
  newPoints = [];
  var isX = true;
  for(var i = 0; i < points.length; ++i) {
	if(isX) {
  	newPoints.push(points[i] + dx);
  	isX = false;
	} else {
  	newPoints.push(points[i] + dy);
  	isX = true;
	}
  }
  return newPoints;
}

function rotateBy(points, angle) {
  newPoints = [];
  var isX = true;
  for(var i = 0; i < points.length; ++i) {
	if(isX) {
  	newX = points[i] * Math.cos(angle) - points[i+1] * Math.sin(angle);
  	newPoints.push(newX);
  	isX = false;
	} else {
  	newY = points[i-1] * Math.sin(angle) + points[i] * Math.cos(angle);
  	newPoints.push(newY);
  	isX = true;
	}
  }
  return newPoints;
}

function tickMark(hour, distance) {
  angle = 360/12 * hour;
  points = [0, -distance, 0, -distance+5];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  buf.drawLine(points[0], points[1], points[2], points[3]);
}

function tickNumber(hour, distance) {
  angle = 360/12 * (hour - 0.00);
  points = [0, -distance+10, 0];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  buf.setFontVector(12);
  buf.drawString(hour.toString(), points[0], points[1]);
}

function drawHands() {
  if (!Bangle.isLCDOn()) return;
  buf.clear();
  // inner circle
  buf.drawCircle(width/2, height/2, 10);
  // draw numbers: seconds
  curDate = Date(Date.now());
  seconds = curDate.getSeconds();
  tickBelow = Math.floor(seconds / 60 * 12);
  tickAbove = Math.ceil(seconds / 60 * 12);
  if(tickAbove == tickBelow) {
	++tickAbove;
	tickMark(tickBelow--, height/2);
  }
  tickMark(tickBelow, height/2);
  tickMark(tickAbove, height/2);  
  // draw numbers: minutes
  minutes = curDate.getMinutes();
  tickMinute = Math.round(minutes / 60 * 12);
  if(tickMinute == 0) {
      tickMinute = 12;
  }
  tickNumber(tickMinute, height/2);
  // draw numbers: hours
  hours = curDate.getHours();
  if(hours > 12) {
	hours -=12;
  }
  tickHour = Math.round(hours);
  if(tickHour == 0) {
      tickHour = 12;
  }
  tickNumber(tickHour, height/2);

  drawHand(seconds/60 * 360, 1, 90, false);
  drawHand(minutes/60 * 360, 4, 80, true);
  drawHand(hours/12 * 360 + 360/(12*60)*minutes, 8, 60, true);
  flip();
}

function drawHand(angle, handWidth, relHandLength, fill) {

  var handLength = relHandLength / 100.0 * height/2;
  
  var centerX = 0;
  var centerY = -10;

  var gutX = handWidth/2;
  var gutY = -handLength * 0.8;

  var tipX = 0;
  var tipY = -handLength;

  var backX = -handWidth/2;
  var backY = -handLength * 0.8;

  var points = [centerX, centerY, gutX, gutY, tipX, tipY, backX, backY];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);

  if(fill) {
    buf.fillPoly(points, true);
  } else {
    buf.drawPoly(points, true);
  }
}

//###### DIGITAL CLOCK
function showTime() {
  buf.clear();
  buf.setFontVector(40);
  var curDate = Date(Date.now());
  var hours = ('00' + curDate.getHours()).slice(-2);
  var minutes = ('00' + curDate.getMinutes()).slice(-2);
  var seconds = ('00' + curDate.getSeconds()).slice(-2);
  buf.drawString(hours + ":" + minutes + ":" + seconds, 0,30);
  colR = colB = colG = 1.0;
//  flip();
  buf.setFontVector(10);
  var year = '' + curDate.getFullYear();
  var month = ('00' + (curDate.getMonth() + 1)).slice(-2);
  var day = ('00' + curDate.getDate()).slice(-2);
  buf.drawString(day + "." + month + "." + year, 70, 100);
  colR = colB = 0.9;
  flip();
}

var mode = 0;
var drawFunction = drawHands;

function changeMode() {
  console.log("Change");
  if(mode == 0) {
    mode = 1;
    drawFunction = showTime;
  } else {
    mode = 0;
    drawFunction = drawHands;
  }
  clearInterval(timerID);
  drawFunction();
  timerID = setInterval(drawFunction, 1000);
}

Bangle.on('lcdPower',function(on) {
  if (on)
    drawFunction();
});

//dir left = -1, right = 1
Bangle.on('swipe', function(dir) {
  changeMode();
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
// Update time once a second
var timerID = setInterval(drawFunction, 1000);
drawFunction();

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
