var locale = require("locale");
// Offscreen buffer
var buf = Graphics.createArrayBuffer(180,180,1,{msb:true});

var width = 160;
var height = 160;

function flip() {
  g.setColor(0.8,1,0.8);
  g.drawImage({width:buf.getWidth(),height:buf.getHeight(),buffer:buf.buffer},40,40);
}

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
  angle = 360/12 * (hour - 0.05);
  points = [0, -distance+10, 0];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  buf.drawString(hour.toString(), points[0], points[1]);
}

function drawHands() {
  if (!Bangle.isLCDOn()) return;
  buf.clear();
  buf.drawCircle(width/2, height/2, width/2);
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
  tickNumber(tickMinute, height/2);
  // draw numbers: hours
  hours = curDate.getHours();
  if(hours > 12) {
	hours -=12;
  }
  tickHour = Math.round(hours);
  tickNumber(tickHour, height/2);

  drawHand(seconds/60 * 360, 1, 90, false);
  drawHand(minutes/60 * 360, 4, 80, true);
  drawHand(hours/12 * 360, 8, 60, true);
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



Bangle.on('lcdPower',function(on) {
  if (on)
    showTime();
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
// Update time once a second
setInterval(drawHands, 1000);
drawHands();

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});
