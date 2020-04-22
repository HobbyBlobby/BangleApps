var height = 0;
var width = 0;

var radius = 0;

var PI = Math.acos(0) * 2;

function moveBy(points, dx, dy) {
  var newPoints = [];
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
  var newPoints = [];
  var isX = true;
  for(var i = 0; i < points.length; ++i) {
	if(isX) {
  	var newX = points[i] * Math.cos(angle) - points[i+1] * Math.sin(angle);
  	newPoints.push(newX);
  	isX = false;
	} else {
  	var newY = points[i-1] * Math.sin(angle) + points[i] * Math.cos(angle);
  	newPoints.push(newY);
  	isX = true;
	}
  }
  return newPoints;
}

function rotateAndMove(points, angle, dx, dy) {
  for(var i = 0; i < points.length; i += 2) {
  	  var x = points[i] * Math.cos(angle) - points[i+1] * Math.sin(angle) + dx;
  	  points[i+1] = points[i] * Math.sin(angle) + points[i+1] * Math.cos(angle) + dy;
      points[i] = x;
  }
  return points;
}

var tickMap = {};
function tickMark(hour, distance) {
  var points = [0, -distance, 0, -distance+5];
  if(tickMap[hour]) {
    points = tickMap.hour;
  } else {
    var angle = 360/12 * hour;
    points = rotateAndMove(points, angle*PI / 180.0, width/2.0, height/2.0);
    tickMap[hour] = points;
  }
  GlobalBuffer.buf.setColor(3);
  GlobalBuffer.buf.drawLine(points[0], points[1], points[2], points[3]);
}

function tickNumber(hour, distance) {
  var angle = 360/12 * (hour - 0.00);
  var points = [0, -distance+10, 0];
  points = rotateAndMove(points, angle*PI / 180.0, width/2.0, height/2.0);
  GlobalBuffer.buf.setColor(3);
  GlobalBuffer.buf.setFontVector(12);
  GlobalBuffer.buf.drawString(hour.toString(), points[0], points[1]);
}

function drawHands() {
  if (!Bangle.isLCDOn()) return;
  height = GlobalBuffer.buf.getHeight();
  width = GlobalBuffer.buf.getWidth();
  radius = GlobalBuffer.buf.getHeight() / 2.0 - 10;	
	
  // inner circle
  GlobalBuffer.buf.setColor(1);
  GlobalBuffer.buf.drawCircle(width/2, height/2, 10);
  // draw numbers: seconds
  var curDate = Date(Date.now());
  var seconds = curDate.getSeconds();
  for(var i = 0; i < 12; i++) {
    tickMark(i, radius);
  }
 
  // draw numbers: minutes
  var minutes = curDate.getMinutes();
//   var tickMinute = Math.round(minutes / 60 * 12);
//   if(tickMinute == 0) {
//       tickMinute = 12;
//   }
//   tickNumber(tickMinute, radius);
  // draw numbers: hours
  var hours = curDate.getHours();
  if(minutes > 30) {
      hours++;
  }
  if(hours > 12) {
	hours -=12;
  }
  var tickHour = Math.round(hours);
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
  points = rotateAndMove(points, angle * PI / 180.0, width/2.0, height/2.0);

  if(fill) {
    GlobalBuffer.buf.setColor(2);
    GlobalBuffer.buf.fillPoly(points, true);
    GlobalBuffer.buf.setColor(3);
    GlobalBuffer.buf.drawPoly(points, true);
  } else {
    GlobalBuffer.buf.setColor(2);
    GlobalBuffer.buf.drawPoly(points, true);
  }
}


exports.draw = function () {
        drawHands();
};
