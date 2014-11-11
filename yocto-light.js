function startVirtualHub() {
  var sys = require('sys')
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) { sys.puts(stdout);console.log(stdout); }
  exec("VirtualHub &", puts);
}


var request = require("request");

var advertisedLux = 0;
var errorMessage = "";
var connected = false;

function updateAdvertisedLux() {
  request(
    "http://localhost:4444/bySerial/LIGHTMK1-1D407/api/lightSensor/advertisedValue",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        advertisedLux = body;
        connected = true;
      } else {
        errorMessage = error.code + " .. Attempting to start virtual hub";
        connected = false;
        startVirtualHub();
      }
    }
  );
}

var updateInterval = setInterval(function() {
  updateAdvertisedLux();
}, 250);

var readoutInterval = setInterval(function() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  if (connected) {
    process.stdout.write("Yocto-light lux: " + String(advertisedLux));
  } else {
    process.stdout.write(String(errorMessage));
  }
}, 500);
