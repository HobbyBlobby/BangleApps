//Bangle.setLCDMode("doublebuffered");
// Bangle.setLCDMode("120x120");
// var width = 240;
// var height = 160;

//Bangle.setLCDMode();
var width = 240;
var height = 240;

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
  points = [0, -distance, 0, -distance-5];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  g.drawLine(points[0], points[1], points[2], points[3]);
}

function tickNumber(hour, distance) {
  angle = 360/12 * (hour - 0.05);
  points = [0, -distance, 0];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  g.drawString(hour.toString(), points[0], points[1]);
}

function drawHands() {
  g.clear();
  // inner circle
  g.drawCircle(width/2, height/2, 10);
  // draw numbers: seconds
  curDate = Date(Date.now());
  seconds = curDate.getSeconds();
  tickBelow = Math.floor(seconds / 60 * 12);
  tickAbove = Math.ceil(seconds / 60 * 12);
  if(tickAbove == tickBelow) {
	++tickAbove;
	tickMark(tickBelow--, 108);
  }
  tickMark(tickBelow, 108);
  tickMark(tickAbove, 108);  
  // draw numbers: minutes
  minutes = curDate.getMinutes();
  tickMinute = Math.round(minutes / 60 * 12);
  tickNumber(tickMinute, 100);
  // draw numbers: hours
  hours = curDate.getHours();
  if(hours > 12) {
	hours -=12;
  }
  tickHour = Math.round(hours);
  tickNumber(tickHour, 100);

  drawHand(seconds/60 * 360, 1, 100, false);
  drawHand(minutes/60 * 360, 4, 80, true);
  drawHand(hours/12 * 360, 8, 60, true);
  g.flip();
}

function drawHand(angle, handWidth, handLength, fill) {

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
    g.fillPoly(points, true);
  } else {
    g.drawPoly(points, true);
  }
}

setInterval(function() {drawHands();}, 1000);
