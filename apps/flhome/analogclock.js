var height = GlobalBuffer.bufMain.height;
var width = GlobalBuffer.bufMain.width;

var radius = GlobalBuffer.bufMain.height;

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
  GlobalBuffer.bufHeighlight.drawLine(points[0], points[1], points[2], points[3]);
}

function tickNumber(hour, distance) {
  angle = 360/12 * (hour - 0.00);
  points = [0, -distance+10, 0];
  points = rotateBy(points, angle * PI / 180);
  points = moveBy(points, width/2, height/2);
  GlobalBuffer.bufHeighlight.setFontVector(12);
  GlobalBuffer.bufHeighlight.drawString(hour.toString(), points[0], points[1]);
}

function drawHands() {
  if (!Bangle.isLCDOn()) return;
  // inner circle
  GlobalBuffer.bufBG.drawCircle(width/2, height/2, 10);
  // draw numbers: seconds
  curDate = Date(Date.now());
  seconds = curDate.getSeconds();
  tickBelow = Math.floor(seconds / 60 * 12);
  tickAbove = Math.ceil(seconds / 60 * 12);
  if(tickAbove == tickBelow) {
	++tickAbove;
	tickMark(tickBelow--, radius);
  }
  tickMark(tickBelow, radius);
  tickMark(tickAbove, radius);  
  // draw numbers: minutes
  minutes = curDate.getMinutes();
  tickMinute = Math.round(minutes / 60 * 12);
  if(tickMinute == 0) {
      tickMinute = 12;
  }
  tickNumber(tickMinute, radius);
  // draw numbers: hours
  hours = curDate.getHours();
  if(hours > 12) {
	hours -=12;
  }
  tickHour = Math.round(hours);
  if(tickHour == 0) {
      tickHour = 12;
  }
  tickNumber(tickHour, radius);

  drawHand(seconds/60 * 360, 1, 90, false);
  drawHand(minutes/60 * 360, 4, 80, true);
  drawHand(hours/12 * 360 + 360/(12*60)*minutes, 8, 60, true);
}

function drawHand(angle, handWidth, relHandLength, fill) {
  var handLength = relHandLength / 100.0 * radius;
  
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
    GlobalBuffer.bufMain.fillPoly(points, true);
    GlobalBuffer.bufHeighlight.drawPoly(points, true);
  } else {
    GlobalBuffer.bufMain.drawPoly(points, true);
  }
}


exports.draw = function () {
//        GlobalBuffer.bufMain.drawString("Hello Analog", 10, GlobalBuffer.bufMain.height / 2);
//        GlobalBuffer.bufHeighlight.drawString("Second Text", 20, GlobalBuffer.bufHeighlight.height/2+ 50);
        drawHands();
    };
