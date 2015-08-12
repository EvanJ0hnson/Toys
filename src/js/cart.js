'use strict';

function WICard(obj) {
  this.objNAME = obj;
  this.DATA = null;
  this.IDS = null;
  this.widjetObj = null;
  this.widjetID = null;

  this.init = function (widjetID) {
    this.DATA = JSON.parse(localStorage.getItem(widjetID)) || {};

    this.IDS = JSON.parse(localStorage.getItem(widjetID + "_ids")) || [];

    this.widjetID = widjetID;
    this.widjetObj = $('#' + widjetID);

    if ($.isEmptyObject(this.DATA)) {
      this.widjetObj.attr('data-badge', '0');
    } else {
      this.reCalc();
      var idkey = null;

      for (idkey in this.DATA) {
        if (this.DATA.hasOwnProperty(idkey)) {
          $('[data-id=' + idkey + ']').attr('disabled', true);
          // $('[data-tooltipID=' + idkey + ']').html('Добавлено');
          // sum += parseFloat(parseInt(this.DATA[idkey].num, 10) * parseFloat(this.DATA[idkey].price, 10));
        }
      }
    }
  };

  this.addToCart = function (id, name, price1, price2, price3) {
    id = ($.isNumeric(id)) ? 'ID' + id.toString() : id;

    // Нужно убрать проверку  === true и передавать '' вместо false
    // И вообще, какая-то здесь ерунда с render
    // render = render || true;

    // var curBtn = $('[data-id='+id+']');
    $('[data-id=' + id + ']').attr('disabled', true);
    // $('[data-tooltipID=' + id + ']').html('Добавлено');

    var goodieLine = {
      'id': id,
      'name': name,
      'price': price1,
      'price2': price2,
      'price3': price3,
      'num': 1,
      'rent': '1 неделя'
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


    // if (render === true) {
    //   this.renderBasketTable();
    // }
  };

  this.rentDuration = function (id) {
    id = ($.isNumeric(id)) ? 'ID' + id.toString() : id;

    var rent = $('#cart-rentDuration' + id + ' option:selected').text();

    // $('[data-id=' + id + ']').attr('disabled', true);
    // $('[data-tooltipID=' + id + ']').html('Добавлено');

    var idKey = null;
    for (idKey in this.DATA) {
      if (this.DATA.hasOwnProperty(idKey)) {
        if (idKey === id) {
          this.DATA[idKey].rent = rent;
        }
      }
    }

    localStorage.setItem(this.widjetID, JSON.stringify(this.DATA));
    localStorage.setItem(this.widjetID + '_ids', JSON.stringify(this.IDS));

    this.renderBasketTable();
  };

  this.delItem = function (id) {
    id = ($.isNumeric(id)) ? 'ID' + id.toString() : id;
    // switch (count) {
    // case "all":
      delete this.DATA[id];
      var ind = $.inArray(id, this.IDS);
      if (ind >= 0) {
        this.IDS.splice(ind, 1);
      }
    //   break;
    // case "one":
    //   var idKey;
    //   for (idKey in this.DATA) {
    //     if (this.DATA.hasOwnProperty(idKey)) {
    //       if (idKey === id) {
    //         if (this.DATA[idKey].num === 1) {
    //           delete this.DATA[id];
    //           this.IDS.splice($.inArray(id, this.IDS), 1);
    //         } else {
    //           this.DATA[idKey].num -= 1;
    //         }
    //       }
    //     }
    //   }
    //   break;
    // default:
    //   console.log('Error, please add one/all');
    //   break;
    // }

    this.reCalc();
    this.renderBasketTable();

    localStorage.setItem(this.widjetID, JSON.stringify(this.DATA));
    localStorage.setItem(this.widjetID + "_ids", JSON.stringify(this.IDS));
  };

  this.reCalc = function () {
    var num = 0,
      counter = 0,
      idkey = null;

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        counter++;
        num += parseInt(this.DATA[idkey].num, 10);
        // $('[data-id='+idkey+']').attr('disabled', true);
        // sum += parseFloat(parseInt(this.DATA[idkey].num, 10) * parseFloat(this.DATA[idkey].price, 10));
      }
    }

    if (num > 0) {
      this.widjetObj.attr('data-badge', counter);
    } else {
      this.widjetObj.attr('data-badge', '0');
    }
  };

  this.renderBasketTable = function () {
    var sum = 0,
      counter = 0,
      idkey = null,
      tBody = null,
      tmpStr = null,
      price = 0,
      selected1 = 'selected',
      selected2 = '',
      selected3 = '';

    $('#popup_cart').html('');

    tmpStr = '<table class="cart-table">';
      tmpStr += '<thead class="cart-table cart-table__header">';
        tmpStr += '<tr>';
          // tmpStr += '<th>№</th>';
          tmpStr += '<th>Название</th>';
          tmpStr += '<th>Срок аренды</th>';
          tmpStr += '<th>Цена</th>';
          tmpStr += '<th></th>';
        tmpStr += '</tr>';
      tmpStr += '</thead>';
      tmpStr += '<tbody id="cart-table--body">'
        // tBody
      tmpStr += '</tbody>'
    tmpStr += '</table>';
    tmpStr += '<div>';
      tmpStr += '<span id="cart-sum"></span>';
    tmpStr += '</div>';

    $('#popup_cart').append(tmpStr);

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        selected1 = selected2 = selected3 = price = '';
        switch (this.DATA[idkey].rent) {
           case '1 неделя':
              price = this.DATA[idkey].price;
              selected1 = 'selected';
              break
           case '2 недели':
              price = this.DATA[idkey].price2;
              selected2 = 'selected';
              break
           case 'Месяц':
              price = this.DATA[idkey].price3;
              selected3 = 'selected';
              break
           default:
              break
        };
        sum += parseFloat(price * this.DATA[idkey].num);
        counter++;
        tBody += '<tr>';
          // tBody += '<td> ' + counter + '</td>';
          tBody += '<td>' + this.DATA[idkey].name + '</td>';
          tBody += '<td>';
            tBody += '<select id="cart-rentDuration' + this.DATA[idkey].id + '" onchange="' + this.objNAME + '.rentDuration(\'' + this.DATA[idkey].id + '\')">';
              tBody += '<option '+ selected1 + ' value="1">1 неделя</option>';
              tBody += '<option '+ selected2 + ' value="2">2 недели</option>';
              tBody += '<option '+ selected3 + ' value="3">Месяц</option>';
            tBody += '</select>';
          tBody += '</td>';
          tBody += '<td>' + price + '</td>';
          tBody += '<td>';
            tBody += '<button id="btnDelItem' + this.DATA[idkey].id + '" \
                      class="mdl-button mdl-button--icon mdl-button--colored" \
                      onclick="' + this.objNAME + '.delItem(\'' + this.DATA[idkey].id + '\')">';
              tBody += '<i class="icon material-icons">delete</i>';
            tBody += '</button>';
          tBody += '</td>';
        tBody += '</tr>';
      }
    }
    tBody += '<tr><td id="cart-sum" class="cart-table__total" colspan="4">Общая сумма: ' + sum + '</td></tr>';

    $('#cart-table--body').append(tBody);
  };

  this.getItems = function () {
    var items = '',
      sum = 0,
      counter = 0,
      idkey = null,
      productLine = null,
      price = 0;

    for (idkey in this.DATA) {
      if (this.DATA.hasOwnProperty(idkey)) {
        switch (this.DATA[idkey].rent) {
           case '1 неделя':
              price = this.DATA[idkey].price;
              break
           case '2 недели':
              price = this.DATA[idkey].price2;
              break
           case 'Месяц':
              price = this.DATA[idkey].price3;
              break
           default:
              break
        };
        sum += parseFloat(price * this.DATA[idkey].num);
        counter++;
        productLine = '№' + counter + ' «' + this.DATA[idkey].name + '» ' + this.DATA[idkey].rent + ' ' + price + '\n';
        items += productLine;
      }
    }
    items += '\nИтого:' + sum;
    return items;
  };
}