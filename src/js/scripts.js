var cart;
var cataloguePath = 'json/items.json';

function switchLeftMenu () {
  $('.nav-left').toggle(100);
  $('.nav-left__switcher').toggle(100);
  $('.nav-left__overlay').toggle(100);
};

function initCart () {
  cart = new WICard("cart");
  cart.init("cart-widjet");
};

function smoothScroll() {
  $('a[href^="#"], a[href^="."]').click(function () {
  // если в href начинается с # или ., то ловим клик
    var scroll_el = $(this).attr('href');
    // возьмем содержимое атрибута href
    if ($(scroll_el).length !== 0) {
    // проверим существование элемента чтобы избежать ошибки
      $('body').animate({ scrollTop: $(scroll_el).offset().top }, 500); // анимируем скроолинг к элементу scroll_el
    }
    return false; // выключаем стандартное действие
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

function renderCatalogue (json) {
        //- Считываем данные из json.
        //- Для каждой категории создаём строку и в конце цикла
        //- добавляем её на страницу.
        $.getJSON(json, function(menuItems) {
          var tmp = '';
          var strAvailable = '';
          var isReserved = '';
          $.each(menuItems, function(key, value) {
            $.each(value.items, function(key2, value2) {
              strAvailable = 'В НАЛИЧИИ';
              isReserved = '';
              if (value2.photo == '') {
                value2.photo = value2.id + '.jpg'
                }
              if (value2.available == 'false') {
                strAvailable += ' C ' + value2.date;
                isReserved = 'toys-card__availability--isReserved';
              }
              tmp += '<div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--12-col-phone mdl-card mdl-shadow--4dp">';
                tmp += '<div class="mdl-card__title mdl-card__title--image" style="background: url(img/catalogue/' + value2.photo + ') center center / cover no-repeat;">';
                  // tmp += '<h1 class="mdl-card__title-text">';
                    // tmp += value2.title;
                  // tmp += '</h1>';
                tmp += '</div>';
                tmp += '<div class="mdl-card__title">';
                  tmp += '<h1 class="mdl-card__title-text">';
                    tmp += value2.title;
                  tmp += '</h1>';
                tmp += '</div>';
                tmp += '<div class="mdl-card__supporting-text">';
                  tmp += '<table class="price-table">';
                    tmp += '<thead class="price-table__header">';
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
                tmp += '<div class="mdl-card__actions mdl-card--border toys-card__availability ' + isReserved + '">';
                  tmp += strAvailable;
                tmp += '</div>';
                tmp += '<div class="mdl-card__actions mdl-card--border">';
                  tmp += '<a href="item.html?id=' + value2.id + '" class="mdl-button mdl-js-button mdl-js-ripple-effect" data-infoID="' + value2.id + '">';
                    tmp += 'Подробнее';
                  tmp += '</a>';
                tmp += '</div>';
                tmp += '<div class="mdl-card__menu">';
                //- Посмотреть, зачем присваивается ID.
                //- Удалить, если не нужен.
                  tmp += '<span id="btnDelItem' + value2.id + '" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onclick="cart.addToCart(\'' + value2.id + '\', \'' + value2.title + '\', \'' + value2.price1 + '\')" data-id="ID' + value2.id + '">';
                    tmp += '<i class="material-icons">add</i>';
                  tmp += '</span>';
                  tmp += '<div class="mdl-tooltip" for="btnDelItem' + value2.id + '" data-tooltipID="ID' + value2.id + '">В корзину</div>';
                tmp += '</div>';
              tmp += '</div>';
            });
            $('#' + value.type).after(tmp);
            tmp = '';
            // strAvailable = '';
          });
        });
      };

// {iOS hack to change vh to px
var iOS = navigator.userAgent.match(/(iPod|iPhone)/);
function iosVhHeightBug() {
  var height = $(window).height();
  $('.top').css('min-height', height * 1.25 + 'px');
  $('.top').css('max-height', height * 1.25 + 'px');
  $('.spacer').css('padding-top', height * 0.55 + 'px');
}
if (iOS) {
  iosVhHeightBug();
  $(window).bind('resize', iosVhHeightBug);
}
// iOS hack to change vh to px}