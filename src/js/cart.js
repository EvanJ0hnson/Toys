'use strict';

function WICard(obj) {
  this.objNAME = obj;
  this.DATA = null;
  this.IDS = null;
  this.widjetObj = null;
  this.widjetID = null;

  this.init = function(widjetID) {
    this.DATA = JSON.parse(localStorage.getItem(widjetID)) || {};

    this.IDS = JSON.parse(localStorage.getItem(widjetID + "_ids")) || [];

    this.widjetID = widjetID;
    this.widjetObj = $('#' + widjetID);

    if ($.isEmptyObject(this.DATA)) {
      this.widjetObj.attr('data-badge', '0');
    } else {
      this.reCalc();
    }
  };

  this.addToCart = function(curObj, id, name, price, render) {
    id = ($.isNumeric(id)) ? 'ID' + id.toString() : id;

    // Нужно убрать проверку  === true и передавать '' вместо false
    // И вообще, какая-то здесь ерунда с render
    render = render || true;

    var goodieLine = {
      'id': id,
      'name': name,
      'price': price,
      'num': 1
    };
    if ($.isEmptyObject(this.DATA)) {
      this.DATA[id] = goodieLine;
      this.IDS.push(id);
    } else {
      var idKey = null;
      for (idKey in this.DATA) {
        if (this.DATA.hasOwnProperty(idKey)) {
          if ($.inArray(id, this.IDS) === -1) {
            this.DATA[id] = goodieLine;
            this.IDS.push(id);
          } else {
            if (idKey === id) {
              this.DATA[idKey].num += 1;
            }
          }
        }
      }
    }

    localStorage.setItem(this.widjetID, JSON.stringify(this.DATA));
    localStorage.setItem(this.widjetID + '_ids', JSON.stringify(this.IDS));
    this.reCalc();


    if (render === true) {
      this.renderBasketTable();
    }
  };

  this.delItem = function(id, count) {
    id = ($.isNumeric(id)) ? 'ID' + id.toString() : id;
    switch (count) {
      case "all":
        delete this.DATA[id];
        var ind = $.inArray(id, this.IDS);
        if (ind >= 0) {
          this.IDS.splice(ind, 1);
        }
        break;
      case "one":
        var idKey;
        for (idKey in this.DATA) {
          if (this.DATA.hasOwnProperty(idKey)) {
            if (idKey === id) {
              if (this.DATA[idKey].num === 1) {
                delete this.DATA[id];
                this.IDS.splice($.inArray(id, this.IDS), 1);
              } else {
                this.DATA[idKey].num -= 1;
              }
            }
          }
        }
        break;
      default:
        console.log('Error, please add one/all');
        break;
    }

    this.reCalc();
    this.renderBasketTable();

    localStorage.setItem(this.widjetID, JSON.stringify(this.DATA));
    localStorage.setItem(this.widjetID + "_ids", JSON.stringify(this.IDS));
  };

  this.reCalc = function() {
    var num = 0,
      sum = 0,
      counter = 0,
      idkey = null;

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        counter++;
        num += parseInt(this.DATA[idkey].num, 10);
        sum += parseFloat(parseInt(this.DATA[idkey].num, 10) * parseFloat(this.DATA[idkey].price, 10));
      }
    }

    if (num > 0) {
      this.widjetObj.attr('data-badge', counter);
    } else {
      this.widjetObj.attr('data-badge', '0');
    }
  };

  this.renderBasketTable = function() {
    var sum = 0,
      counter = 0,
      idkey = null,
      productLine = null,
      tableCaption = null;

      $('#popup_cart').html('');

    // if ($('#popup_cart').length === 0) {
      $('#popup_cart').append(' \
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id="cart-table"> \
        <tr class="cart-table-caption"> \
          <td>№</td><td>Название</td><td>Цена</td><td></td><td></td> \
        </tr> \
        </table> \
        <div class="cart-footer"> \
          <span id="cart-sum" class="cart-sum"></span> \
        </div> \
    ');
    // }

              // <button id="btnSubmitMenuReservation" class="mdl-button" name="btnSubmitMenuReservation">Отправить на утверждение</button> \
          // <input type="hidden" name="event" value="sendMenuReservation"> \

    // $('#cart-table').html('');

    // tableCaption = '<tr class="cart-table-caption"><td>№</td><td>Название</td><td>Цена</td><td>Количество</td><td>Сумма</td></tr>';

    // $('#cart-table').append(tableCaption);

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        sum += parseFloat(this.DATA[idkey].price * this.DATA[idkey].num);
        counter++;
        productLine = '<tr class="cart-table-item"> \
        <td>' + counter + '</td> \
        <td>' + this.DATA[idkey].name + '</td> \
        <td class="wigoodprice">' + this.DATA[idkey].price + ' <span class="fa fa-rub"></span></td> \
        <td> \
        <td><a id="btnDelItem'+ this.DATA[idkey].id +'" class="mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect" onclick="' + this.objNAME + '.delItem(\'' + this.DATA[idkey].id + '\', \'all\')"><i class="icon material-icons">delete</i></a><div class="mdl-tooltip" for="btnDelItem'+ this.DATA[idkey].id +'">Удалить</div></td> \
        </tr>';
        $('#cart-table').append(productLine);
      }
    }
    $('#cart-table').append('<tr>><td></td>><td></td><td id="cart-sum"></td>><td></td>><td></td></tr>');
    $('#cart-sum').html('Общая сумма: ' + sum + ' <span class="fa fa-rub"></span>');
  };

  this.getItems = function() {
    var items = "",
      sum = 0,
      counter = 0,
      idkey = null,
      productLine = null;

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        sum += parseFloat(this.DATA[idkey].price * this.DATA[idkey].num);
        counter++;
        productLine = counter + ' ' + this.DATA[idkey].name + ' ' + this.DATA[idkey].price + ' ' + this.DATA[idkey].num + ' :' + parseFloat(this.DATA[idkey].price * this.DATA[idkey].num) + '\n';
        items += productLine;
      }
    }
    items += '\nИтого:' + sum;
    return items;
  };

  this.showWinow = function() {
    this.renderBasketTable();
    $("#popup_cart").toggleClass("visible");
  };
}