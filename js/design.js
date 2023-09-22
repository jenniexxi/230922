/* iphone scroll bug */
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

var UI = UI || {};
UI.hasJqueryObject = function ($el) {
  return $el.length > 0;
};

// 형제 요소
function siblings(node) {
  var children = node.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function (e) {
    return e != node;
  });
}

// layout setting
UI.layoutSet = {
  init: function () {
    this.$wrap = UI.$body.find('#wrap');
    this.$fixTop = this.$wrap.find("[data-ui-fixed='top']");
    this.$fixBtm = this.$wrap.find("[data-ui-fixed='bottom']");
    this.addEvents();
  },
  addEvents: function () {
    var topH = this.$fixTop.outerHeight();
    var btmH = this.$fixBtm.outerHeight();

    this.$wrap.css('padding-top', topH);
    this.$wrap.css('padding-bottom', btmH);
  },
};

// 바디 스크롤 제어
var scrollHeight = 0;
UI.scrollSet = {
  init: function (type) {
    this.$wrap = $('body').find('#wrap');
    // 바디스크롤 제거
    if (type === 'off') {
      scrollHeight = $(document).scrollTop();
      $('body').css('overflow', 'hidden');
      this.$wrap.css('position', 'fixed');
      this.$wrap.css('top', -scrollHeight);
      return scrollHeight;
      // 바디스크롤 제거 해제
    } else if (type === 'on') {
      $('body').css('overflow', '');
      this.$wrap.css('position', 'relative');
      this.$wrap.css('top', 0);
      $(document).scrollTop(scrollHeight);
    }
  },
};

// 팝업 열기
UI.popupOpen = {
  init: function (obj, callback) {
    var popTarget = $('#pop-' + obj);
    popTarget.show().addClass('show');

    if (popTarget.hasClass('ndim')) {
      popTarget.css('left', 0);
    }

    UI.scrollSet.init('off'); // 바디스크롤 제거

    // 영역 외 클릭 닫기
    popTarget.off('click.popClose').on('click.popOpen', function (e) {
      if (!$(this).hasClass('ndim')) {
        if (!$("[class*='ly']").find('.wrap').has(e.target).length) {
          UI.popupClose.init(obj);
        }
      }
    });

    // 토스트 팝업
    if (popTarget.hasClass('ly-toast')) {
      setTimeout(function () {
        if (callback && typeof callback === 'function') {
          callback();
        }
      }, 1500);
    }
  },
};

// 팝업 닫기
UI.popupClose = {
  init: function (obj) {
    var popTarget = $('#pop-' + obj);

    if (popTarget.hasClass('ly-btm')) {
      popTarget.removeClass('show');
    } else {
      popTarget.removeClass('show').hide();
    }

    //팝업 2중으로 띄웠을때
    if ($(document).find('.ly-pop').hasClass('show')) {
      UI.scrollSet.init('off');
    } else {
      UI.scrollSet.init('on');
    }
  },
};

UI.ipFocus = {
  init: function () {
    this.$inputWrap = UI.$body.find('.ip-box');
    this.$ip = this.$inputWrap.find('.ip');
    this.addEvents();
  },
  addEvents: function () {
    var _this = this;
    _this.$ip.each(function (idx) {
      var _input = $(this);
      var _par = $(this).parent();

      _input
        .on('focus', function () {
          _par.addClass('focus');
          $('#wrap').addClass('srch-focus');
          UI.layoutSet.init();

          if (_par.parents().hasClass('ip-srch')) {
            $(this).parents('.ip-srch').find('.btn-txt').show();
            UI.$body.find('#wrap').addClass('res');
          }
        })
        .on('blur', function () {
          _par.removeClass('focus');

          if (!$('.ip-srch').hasClass('ip-amount')) {
            $('#wrap').removeClass('srch-focus');
            UI.layoutSet.init();
          }

          $('#wrap').removeClass('srch-focus');
          UI.layoutSet.init();

          $('.ip-srch').find('.btn-txt').removeClass('in');
          if (_par.parents().hasClass('ip-srch')) {
            UI.$body.find('#wrap').removeClass('res');
          }
          if (!$.trim($(this).val()) == '') {
            _par.find('.lbl').removeClass('show');
            _par.find('.lbl').hide();
          } else {
            _par.find('.lbl').addClass('show');
            _par.find('.lbl').show();
          }
        })
        .blur();
    });

    $('.ip-srch')
      .find('.btn-txt')
      .on('mouseenter', function () {
        $('#wrap').addClass('srch-focus');
        $('.ip-srch').find('.ip-box').removeClass('focus');
        $('.ip-srch').find('.ip-box input').blur();
        $('.ip-srch').find('.btn-txt').hide();
      });
  },
};

UI.inputDel = {
  init: function () {
    var _input = UI.$body.find('.ip-del input');
    _input
      .on('focus keyup', function () {
        if ($.trim($(this).val()) == '') {
          $(this).parents('.ip-del').find('.btn-del').hide();
        } else {
          $(this).parents('.ip-box').removeClass('error');
          $(this).parents('.ip-del').find('.btn-del').show();
        }
      })
      .on('blur', function (e) {
        setTimeout(function () {
          $(e.target).parents('.ip-del').find('.btn-del').hide();
          $('.ip-srch').find('.btn-txt').hide();
        }, 250);
      })
      .blur();
    _input
      .parents('.ip-del')
      .find('.btn-del')
      .on('mouseenter', function () {
        $(this)
          .hide()
          .parents('.ip-del')
          .find('input')
          .val('')
          .trigger('change')
          .focus();
        $(this).parents('.ip-del').find('.lbl').show();
        $('.ip-srch').find('.btn-txt').addClass('in');
      });
  },
};

UI.acco = {
  init: function () {
    this.$accoWrap = UI.$body.find('.acco-list');
    this.$accoItem = this.$accoWrap.find('.item');
    this.$accoTit = this.$accoWrap.find('.btn-tit');
    this.$accoTitActive = this.$accoWrap.find('.btn-tit.on');
    this.$accoCont = this.$accoWrap.find('.cont');
    this.addEvents();
  },
  addEvents: function () {
    var _this = this;
    function handleToggle() {
      if ($(this).hasClass('on')) {
        _this.$accoCont.slideUp(200);
        _this.$accoItem.removeClass('on');
        $(this).removeClass('on');
      } else {
        _this.$accoCont.slideUp(200);
        _this.$accoTit.removeClass('on');
        _this.$accoItem.removeClass('on');
        $(this).parent().addClass('on');
        $(this).addClass('on').next().slideDown(200);
      }
    }
    _this.$accoTit.off('click.toggle').on('click.toggle', handleToggle);
  },
};

UI.tip = {
  init: function () {
    this.constructor();

    this.tipTrigger.forEach(function (trigger) {
      const tooltip = trigger.closest('[data-tip]');
      const target = tooltip.querySelector('[data-tip-target]');
      const close = tooltip.querySelector('[data-tip-close]');

      target.classList.add('hidden');

      UI.tip.show(trigger, target);
      UI.tip.hide(trigger, target, close);
    });
  },
  constructor: function () {
    this.tipTrigger = document.querySelectorAll('[data-tip-trigger]');
    this.isTransitioning = false;
  },
  show: function (trigger, target) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();

      if (UI.tip.isTransitioning) {
        return false;
      }

      if (target.classList.contains('hidden')) {
        target.classList.remove('hidden');
        target.classList.add('showing');

        setTimeout(function () {
          target.classList.add('fade');
        }, 50);
      } else {
        return false;
      }

      UI.tip.transition(target);
    });
  },
  hide: function (trigger, target, close) {
    document.addEventListener('click', function (e) {
      const cTarget = close.closest('[data-tip-target]');

      if (target.classList.contains('shown')) {
        if (UI.tip.isTransitioning) {
          return false;
        }

        if (e.target === close) {
          cTarget.classList.add('hiding');
          cTarget.classList.remove('shown');
          cTarget.classList.remove('fade');
          UI.tip.transition(target);
          return false;
        }

        if (
          target.closest('[data-tip]').getAttribute('data-tip') ===
            'backdrop' &&
          e.target !== target &&
          e.target !== trigger
        ) {
          target.classList.add('hiding');
          target.classList.remove('shown');
          target.classList.remove('fade');
          UI.tip.transition(target);
          return false;
        }
      }
    });
  },
  transition: function (target) {
    target.addEventListener('transitionstart', function transitionstart() {
      UI.tip.setTransitioning(true);
      if (target.classList.contains('showing')) {
        const showing = new CustomEvent('tip.showing');
        target.dispatchEvent(showing);
      } else if (target.classList.contains('hiding')) {
        const hiding = new CustomEvent('tip.hiding');
        target.dispatchEvent(hiding);
      }
      target.removeEventListener('transitionstart', transitionstart);
    });
    target.addEventListener('transitionend', function transitionend() {
      UI.tip.setTransitioning(false);
      if (target.classList.contains('showing')) {
        target.classList.add('shown');
        target.classList.remove('showing');

        const shown = new CustomEvent('tip.shown');
        target.dispatchEvent(shown);
      } else if (target.classList.contains('hiding')) {
        target.classList.add('hidden');
        target.classList.remove('hiding');

        const hidden = new CustomEvent('tip.hidden');
        target.dispatchEvent(hidden);
      }
      target.removeEventListener('transitionend', transitionend);
    });
  },
  setTransitioning: function (isTransitioning) {
    this.isTransitioning = isTransitioning;
  },
};

UI.scrollHeaderFixed = {
  init: function () {
    $(window)
      .on('scroll', function () {
        var st = $(this).scrollTop();
        if (st > 100) {
          $('#wrap').addClass('scrolling');
          $('#header .page-tit').removeClass('blind');
          $('.cont-tit').hide();
        } else {
          $('#wrap').removeClass('scrolling');
          $('#header .page-tit').addClass('blind');
          $('.cont-tit').show();
        }
      })
      .trigger('scroll');
  },
};
$(function () {
  UI.$window = $(window);
  UI.$body = $('body');

  UI.layoutSet.init();
  setTimeout(function () {
    UI.layoutSet.init();
  }, 100);
  if (UI.hasJqueryObject(UI.$body.find('.ip-box input'))) UI.ipFocus.init();
  if (UI.hasJqueryObject(UI.$body.find('.ip-del input'))) UI.inputDel.init();
  if (UI.hasJqueryObject(UI.$body.find('.acco-list'))) UI.acco.init();
  if (UI.hasJqueryObject(UI.$body.find('[data-tip]'))) UI.tip.init();
  if (UI.hasJqueryObject(UI.$body.find('[data-scroll]')))
    UI.scrollHeaderFixed.init();
});
