electron = require("electron");
app = electron.app;
BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on("windowAllClosed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});
