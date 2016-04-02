$ = require("jquery");
remote = require("remote");

browWindow = remote.getCurrentWindow();

$(function() {
  $(".barcode-input").keydown(function(e) {
    var key = String.fromCharCode(e.which);
    if (key == " " || key == "\n" || key == "\t" || key == "\r") {
      e.preventDefault();
      if ($(".barcode-input").val().length > 13 || $(".barcode-input").val().length < 11) {
        $(".barcode-input").val("");
        return;
      }
      var productInfo = $.ajax({
        url: "http://api.upcitemdb.com/prod/trial/lookup?upc=" + encodeURIComponent($(".barcode-input").val()),
        success: function(data, status, fxhr) {
          var item = $(document.createElement("li"));
          var price = $(document.createElement("span"));
          var closer = $(document.createElement("span"));
          var priceMod = $(document.createElement("span"));
          closer.text("clear");
          closer.click(function() {
            $(this).parent().remove();
          });
          priceMod.text("attach_money");
          priceMod.click(function() {
            var i = $(document.createElement("input"));
            i.val($(this).parent().find(".price").clone().children().remove().end().text());
            i.keydown(function(e) {
              if (String.fromCharCode(e.which) == "\n" || String.fromCharCode(e.which) == "\r") {
                e.preventDefault();
                var price = $(this).parent().parent().find(".price");
                price.text(Number(parseFloat($(this).val())).toFixed(2).toString());
                // $(this).remove();
              }
            });
            i.addClass("right");
            $(this).parent().find(".price").html("");
            $(this).parent().find(".price").append(i);
            i.focus();
          });
          closer.addClass("right material-icons");
          priceMod.addClass("right material-icons");
          price.addClass("price");
          item.addClass("item");
          if (data.items.length <= 0) {
            item.text("XXXXXXXXXX");
            price.text("0.00");
            price.append(closer);
            item.append(price);
            $(".items").append(item);
            $(".barcode-input").val("");
          } else {
            item.text(data.items[0].title);
            if (data.items[0]["lowest_recorded_price"] == undefined) {
              price.text("0.00");
            } else {
              price.text(data.items[0]["lowest_recorded_price"].toFixed(2).toString());
            }
            closer.addClass("right");
            item.append(priceMod);
            item.append(closer);
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
