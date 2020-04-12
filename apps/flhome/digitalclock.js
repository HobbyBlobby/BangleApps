function showTime() {
  GlobalBuffer.bufMain.setFontVector(40);
  var curDate = Date(Date.now());
  var hours = ('00' + curDate.getHours()).slice(-2);
  var minutes = ('00' + curDate.getMinutes()).slice(-2);
  var seconds = ('00' + curDate.getSeconds()).slice(-2);
  GlobalBuffer.bufMain.drawString(hours + ":" + minutes + ":" + seconds, 20,30);

  GlobalBuffer.bufHeighlight.setFontVector(10);
  var year = '' + curDate.getFullYear();
  var month = ('00' + (curDate.getMonth() + 1)).slice(-2);
  var day = ('00' + curDate.getDate()).slice(-2);
  GlobalBuffer.bufHeighlight.drawString(day + "." + month + "." + year, 90, 100);
}


exports.draw = function () {
        //GlobalBuffer.bufMain.drawString("Hello Digital", GlobalBuffer.bufMain.width / 2, 10);
        showTime();
    }
