function showTime() {
  GlobalBuffer.buf.setFontVector(40);
  var curDate = Date(Date.now());
  var hours = ('00' + curDate.getHours()).slice(-2);
  var minutes = ('00' + curDate.getMinutes()).slice(-2);
  var seconds = ('00' + curDate.getSeconds()).slice(-2);
  GlobalBuffer.buf.setColor(3);
  GlobalBuffer.buf.drawString(hours + ":" + minutes + ":" + seconds, 20,30);

  GlobalBuffer.buf.setFontVector(20);
  var year = '' + curDate.getFullYear();
  var month = ('00' + (curDate.getMonth() + 1)).slice(-2);
  var day = ('00' + curDate.getDate()).slice(-2);
  GlobalBuffer.buf.setColor(2);
  GlobalBuffer.buf.drawString(day + "." + month + "." + year, 45, 100);
}


exports.draw = function () {
        //GlobalBuffer.bufMain.drawString("Hello Digital", GlobalBuffer.bufMain.width / 2, 10);
        showTime();
    }
