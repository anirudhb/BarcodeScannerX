$ = require("jquery");
remote = require("remote");

browWindow = remote.getCurrentWindow();

$(function() {
  $(".barcode-input").keydown(function(e) {
    var key = String.fromCharCode(e.which);
    if (key == " " || key == "\n" || key == "\t" || key == "\r") {
      e.preventDefault();
      if ($(".barcode-input").val().length > 12 || $(".barcode-input").val().length < 12) {
        $(".barcode-input").val("");
        return;
      }
      var productInfo = $.ajax({
        url: "http://api.upcitemdb.com/prod/trial/lookup?upc=" + encodeURIComponent($(".barcode-input").val()),
        success: function(data, status, fxhr) {
          var item = $(document.createElement("li"));
          var price = $(document.createElement("span"));
          price.addClass("price");
          item.addClass("item");
          if (data.items.length <= 0) {
            item.text("XXXXXXXXXX");
            price.text("0.00");
            item.append(price);
            $(".items").append(item);
            $(".barcode-input").val("");
          } else {
            item.text(data.items[0].title);
            price.text(data.items[0]["lowest_recorded_price"]);
            item.append(price);
            $(".items").append(item);
            $(".barcode-input").val("");
          }
        }
      });
    }
  });
  $(".close").click(function() {
    browWindow.close();
  });
  $(".fullscreen").click(function() {
    if (browWindow.isFullScreen()) {
      browWindow.setFullScreen(false);
    } else {
      browWindow.setFullScreen(true);
    }
    $(".wrapper").css("height", (browWindow.getBounds().height - 100).toString());
  });
  $(".resize").click(function() {
    if (browWindow.isMaximized()) {
      browWindow.unmaximize();
    } else {
      browWindow.maximize();
    }
    $(".wrapper").css("height", (browWindow.getBounds().height - 100).toString());
  });
  $(".collapse").click(function() {
    browWindow.minimize();
  });
  $(".wrapper").css("height", (browWindow.getBounds().height - 100).toString());
  browWindow.resize = function() {
    $(".wrapper").css("height", (browWindow.getBounds().height - 100).toString());
  };
});
