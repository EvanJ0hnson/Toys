var cart;
var cataloguePath = 'json/items.json';

function matchCardsHeight () {
  $('.bl').matchHeight();
}

function switchLeftMenu () {
  $('.nav-left').toggle(100);
  $('.nav-left__switcher').toggle(100);
  $('.nav-left__overlay').toggle(100);
}

function switchTopMenu () {
  $('.nav-top__hidden-row').toggle(100);
  // $('.nav-top__link--categories').html('');
}

function initCart () {
  cart = new WICard("cart");
  cart.init("cart-widjet");
}

function smoothScroll() {
  $('a[href^="#"], a[href^="."]').click(function () {
  // если в href начинается с # или ., то ловим клик
    var scroll_el = $(this).attr('href');
    // возьмем содержимое атрибута href
    // if ($(scroll_el).length !== 0) {
    // проверим существование элемента чтобы избежать ошибки
      $('body').animate({ scrollTop: $(scroll_el).offset().top - 30 }, 1200); // анимируем скроолинг к элементу scroll_el
    // }
    return false; // выключаем стандартное действие
  });
}

function formSubmit() {
  var scriptFilePath = 'scripts/mailSender.php';
  $('#fOrderReservation').on('submit', function () {
    var msg  = $("#userContact").val();
    if ((msg === '') || (msg === 'Спасибо, мы вам перезвоним!')) {
      alert("Введите контактные данные, пожалуйста.");
      return false;
    }
    var cartItems = cart.getItems();
    $.ajax({
      type: 'POST',
      url: scriptFilePath,
      data: $(this).serialize() + '&formBody=Имя и контактные данные: ' + msg + '\n\nЗАКАЗ\n' + cartItems,
      success: function (answer) {
        $('#userContact').val(answer);
      }
    });
    return false;
  });
}

function createTopSlider() {
  $('.cd-topslider-wrapper').flexslider({
    selector: ".cd-topslider > div",
    animation: "slide",
    controlNav: true,
    directionNav: false,
    keyboard: false,
    slideshow: true,
    animationSpeed: 1000,
    slideshowSpeed: 3500,
    start: function () {
      $('.cd-topslider').children('div').css({
        'opacity': 1,
        'position': 'relative'
      });
    }
  });
}

function renderItemDescription (desc) {
  var tmp = '',
      strAvailable = '',
      isReserved = '';

  strAvailable = 'В НАЛИЧИИ';
  isReserved = '';

  if (desc.photo == '') {
    desc.photo = desc.id + '.jpg'
    }
  if (desc.available == 'Нет') {
    strAvailable += ' C ' + desc.date;
    isReserved = 'toys-card__availability--isReserved';
  }

        tmp += '<div class="col bl--big mdl-card mdl-shadow--4dp">';
          tmp += '<div class="mdl-card__title toys-card__availability ' + isReserved + '">';
            tmp += '<h1 class="mdl-card__title-text">';
              tmp += desc.title;
            tmp += '</h1>';
            tmp += '<div class="mdl-card__menu">';
              tmp += '<span id="btnDelItem' + desc.id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onclick="cart.addToCart(\'' + desc.id + '\', \'' + desc.title + '\', \'' + desc.price1 + '\', \'' + desc.price2 + '\', \'' + desc.price3 + '\')" data-id="ID' + desc.id + '">';
                tmp += '<i class="material-icons">add</i>';
              tmp += '</span>';
              tmp += '<div class="mdl-tooltip" for="btnDelItem' + desc.id + '" data-tooltipID="ID' + desc.id + '">В корзину</div>';
            tmp += '</div>';
          tmp += '</div>';
          tmp += '<div class="mdl-card__title">';
            tmp += '<h1 class="mdl-card__title-text">';
              tmp += strAvailable;
            tmp += '</h1>';
          tmp += '</div>';
          tmp += '<div class="mdl-card__title">';
            tmp += '<img class="mdl-card__title-image" src="img/catalogue/' + desc.photo + '">'
          tmp += '</div>';
          tmp += '<div class="mdl-card__supporting-text">';
            tmp += 'Рекомендуемый возраст: <br>' + desc.age;
            tmp += '<br>';
            tmp += '<br>';
            tmp += desc.description;
          tmp += '</div>';
          tmp += '<div class="mdl-card__supporting-text mdl-card__actions mdl-card--border">';
            tmp += '<table class="toys-card__price-table">';
              tmp += '<thead class="toys-card__price-table--header">';
                tmp += '<tr>';
                  tmp += '<td>1 неделя</td>';
                  tmp += '<td>2 недели</td>';
                  tmp += '<td>Месяц</td>';
                tmp += '</tr>';
              tmp += '</thead>';
              tmp += '<tbody>';
                tmp += '<tr>';
                  tmp += '<td>' + desc.price1 + '</td>';
                  tmp += '<td>' + desc.price2 + '</td>';
                  tmp += '<td>' + desc.price3 + '</td>';
                tmp += '</tr>';
              tmp += '</tbody>';
            tmp += '</table>';
          tmp += '</div>';
          // tmp += '<div class="mdl-card__actions mdl-card--border">';
          //   tmp += '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" onclick="cart.addToCart(\'' + desc.id + '\', \'' + desc.title + '\', \'' + desc.price1 + '\', \'' + desc.price2 + '\', \'' + desc.price3 + '\')" data-id="ID' + desc.id + '">';
          //     tmp += 'Добавить в корзину';
          //   tmp += '</button>';
          // tmp += '</div>';
        tmp += '</div>';
  
  $('.section').prepend(tmp);
};

function requireItemDescription () {
  var scriptPath = 'scripts/itemsRouter.php';
  var params = location.search.substring(1).split('=');
  $.post(scriptPath, {itemId: params[1]}, function(serverResponse) {
        renderItemDescription(serverResponse);
    } ,"json");
};

function renderCatalogue (json) {
  //- Считываем данные из json.
  //- Для каждой категории создаём строку и в конце цикла
  //- добавляем её на страницу.
  $.getJSON(json, function(menuItems) {
    var tmp = '',
        strAvailable = '',
        isReserved = '',
        isNew = '';

    $.each(menuItems, function(key, value) {
      $.each(value.items.reverse(), function(key2, value2) {
        strAvailable = 'В НАЛИЧИИ';
        isReserved = '';
        isNew = value2.new;

        if (value2.photo == '') {
          value2.photo = value2.id + '.jpg';
          }
        if (value2.available == 'Нет') {
          strAvailable += ' C ' + value2.date;
          isReserved = 'toys-card__availability--isReserved';
        }

        tmp += '<div class="col bl mdl-card mdl-shadow--4dp">';
          tmp += '<div class="mdl-card__title toys-card__availability ' + isReserved + '">';
            tmp += '<h1 class="mdl-card__title-text">';
              tmp += value2.title;
            tmp += '</h1>';
            tmp += '<div class="mdl-card__menu">';
              tmp += '<span id="btnDelItem' + value2.id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onclick="cart.addToCart(\'' + value2.id + '\', \'' + value2.title + '\', \'' + value2.price1 + '\', \'' + value2.price2 + '\', \'' + value2.price3 + '\')" data-id="ID' + value2.id + '">';
                tmp += '<i class="material-icons">add</i>';
              tmp += '</span>';
              tmp += '<div class="mdl-tooltip" for="btnDelItem' + value2.id + '" data-tooltipID="ID' + value2.id + '">В корзину</div>';
            tmp += '</div>';
          tmp += '</div>';
          tmp += '<div class="mdl-card__title">';
            tmp += '<h1 class="mdl-card__title-text">';
              tmp += strAvailable;
            tmp += '</h1>';
          tmp += '</div>';
          tmp += '<div class="mdl-card__title">';
            tmp += '<img class="mdl-card__title-image" src="img/catalogue/' + value2.photo + '">'
          tmp += '</div>';
          tmp += '<div class="mdl-card__supporting-text mdl-card__actions mdl-card--border">';
            tmp += '<table class="toys-card__price-table">';
              tmp += '<thead class="toys-card__price-table--header">';
                tmp += '<tr>';
                  tmp += '<td>1 неделя</td>';
                  tmp += '<td>2 недели</td>';
                  tmp += '<td>Месяц</td>';
                tmp += '</tr>';
              tmp += '</thead>';
              tmp += '<tbody>';
                tmp += '<tr>';
                  tmp += '<td>' + value2.price1 + '</td>';
                  tmp += '<td>' + value2.price2 + '</td>';
                  tmp += '<td>' + value2.price3 + '</td>';
                tmp += '</tr>';
              tmp += '</tbody>';
            tmp += '</table>';
          tmp += '</div>';
          tmp += '<div class="mdl-card__actions mdl-card--border">';
            tmp += '<a href="item.html?id=' + value2.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect" data-infoID="' + value2.id + '">';
              tmp += 'Подробнее';
            tmp += '</a>';
          tmp += '</div>';
        tmp += '</div>';

        // $('#cat__main').after(tmp);
        if (isNew == 'Да') {
          $('#cat__new').after(tmp);
          }
        $('#' + value.type).after(tmp);
        tmp = '';
      });
    });
  });
};

// {iOS hack to change vh to px
// var iOS = navigator.userAgent.match(/(iPod|iPhone)/);
// function iosVhHeightBug() {
//   var height = $(window).height();
//   $('.top').css('min-height', height * 1.25 + 'px');
//   $('.top').css('max-height', height * 1.25 + 'px');
//   $('.spacer').css('padding-top', height * 0.55 + 'px');
// }
// if (iOS) {
//   iosVhHeightBug();
//   $(window).bind('resize', iosVhHeightBug);
// }
// iOS hack to change vh to px}