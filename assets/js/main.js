/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');
		

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);

		});
	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();
									
								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}
					
	/*			// Was previous article.	
					if ($body.hasClass('is-article-visible')) {
						
						var $currentArticle = $main_articles.filter('.active');
						$currentArticle.removeClass('active');
						
						setTimeout(function () {
								$currentArticle.hide();
								$article.show();
								
								setTimeout(function () {
										$article.addClass('active');
										$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);
									})
						//	$window.history.back();})
						}*/

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();
					
						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
						setTimeout(function() {

							$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');
						//				.history.back();

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
					
/*----------------------------------------------------------------*/

var $cont = document.querySelector('.cont');
var $elsArr = [].slice.call(document.querySelectorAll('.el'));
var $closeBtnsArr = [].slice.call(document.querySelectorAll('.el__close-btn'));

setTimeout(function() {
  $cont.classList.remove('s--inactive');
}, 200);

$elsArr.forEach(function($el) {
  $el.addEventListener('click', function() {
    if (this.classList.contains('s--active')) return;
    $cont.classList.add('s--el-active');
    this.classList.add('s--active');
  });
});

$closeBtnsArr.forEach(function($btn) {
  $btn.addEventListener('click', function(e) {
    e.stopPropagation();
    $cont.classList.remove('s--el-active');
    document.querySelector('.el.s--active').classList.remove('s--active');
  });
});

/*------------------------------------------------------------------------*/

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function rafThrottle(fn) {
  var busy = false;
  return function() {
    if (busy) return;
    busy = true;
    fn.apply(this, arguments);
    requestAnimFrame(function() {
      busy = false;
    });
  };
};

$(document).ready(function() {

  var $wsPages = $(".ws-pages");
  var $headings = $(".ws-text__heading");
  var bgParts = 24;
  var staggerVal = 65;
  var staggerStep = 4;
  var textH = $(".ws-text").height();
  var winW = $(window).width();
  var winH = $(window).height();
  var curPage = 1;
  var numOfPages = $(".ws-bg").length;
  var changeAT = 0.5;
  var waveStartDelay = 0.2;
  var waveStagger = 0.013;
  var waveBlocked = false;
  var index = 1;
  var startY = 0;
  var deltaY = 0;
  var headingsY = 0;
  var $parts;

  function initBgs() {
    var arr = [];
    var partW = 100 / bgParts;

    for (var i = 1; i <= bgParts; i++) {
      var $part = $('<div class="ws-bg__part">');
      var $inner = $('<div class="ws-bg__part-inner">');
      var innerLeft = 100 / bgParts * (1 - i);

      $inner.css("left", innerLeft + "vw");
      $part.append($inner);
      $part.addClass("ws-bg__part-" + i).width(partW + "%");
      arr.push($part);
    }

    $(".ws-bg").append(arr);
    $wsPages.addClass("s--ready");
    $parts = $(".ws-bg__part");
  };

  initBgs();

  function changePages() {
    var y = (curPage - 1) * winH * -1;
    var textY = textH * (curPage - 1) * -1;
    var leftMax = index - 1;
    var rightMin = index + 1;

    TweenLite.to(".ws-bg__part-" + index, changeAT, {y: y});

    for (var i = leftMax; i > 0; i--) {
      var d = (index - i) * waveStagger;
      TweenLite.to(".ws-bg__part-" + i, changeAT - d, {y: y, delay: d});
    }

    for (var j = rightMin; j <= bgParts; j++) {
      var d = (j - index) * waveStagger;
      TweenLite.to(".ws-bg__part-" + j, changeAT - d, {y: y, delay: d});
    }

    TweenLite.to($headings, changeAT, {y: textY});
  };

  function waveChange() {
    waveBlocked = true;
    var y = (curPage - 1) * winH * -1;
    var textY = textH * (curPage - 1) * -1;

    for (var i = 1; i <= bgParts; i++) {
      var d = (i - 1) * waveStagger + waveStartDelay;
      TweenLite.to(".ws-bg__part-" + i, changeAT, {y: y, delay: d});
    }

    TweenLite.to($headings, changeAT, {y: textY, delay: d});

    var delay = (changeAT + waveStagger * (bgParts - 1)) * 1000;
    setTimeout(function() {
      waveBlocked = false;
    }, delay);
  };

  function navigateUp() {
    if (curPage > 1) curPage--;
  };

  function navigateDown() {
    if (curPage < numOfPages) curPage++;
  };

  function navigateWaveUp() {
    if (curPage === 1) return;
    curPage--;
    waveChange();
  };

  function navigateWaveDown() {
    if (curPage === numOfPages) return;
    curPage++;
    waveChange();
  };

  function movePart($part, y) {
    var y = y - (curPage - 1) * winH;
    var headY = headingsY - (curPage - 1) * textH;
    TweenLite.to($part, changeAT, {y: y, ease: Back.easeOut.config(4)});
    TweenLite.to($headings, changeAT, {y: headY});
  };

  function moveParts(y, index) {
    var leftMax = index - 1;
    var rightMin = index + 1;
    var stagLeft = 0;
    var stagRight = 0;
    var stagStepL = 0;
    var stagStepR = 0;
    var sign = (y > 0) ? -1 : 1;

    movePart(".ws-bg__part-" + index, y);

    for (var i = leftMax; i > 0; i--) {
      var step = index - i;
      var sVal = staggerVal - stagStepL;
      stagStepL += (step <= 15) ? staggerStep : 1;
      if (sVal < 0) sVal = 0;
      stagLeft += sVal;
      var nextY = y + stagLeft * sign;
      if (Math.abs(y) < Math.abs(stagLeft)) nextY = 0;
      movePart(".ws-bg__part-" + i, nextY);
    }

    for (var j = rightMin; j <= bgParts; j++) {
      var step = j - index;
      var sVal = staggerVal - stagStepR;
      stagStepR += (step <= 15) ? staggerStep : 1;
      if (sVal < 0) sVal = 0;
      stagRight += sVal;
      var nextY = y + stagRight * sign;
      if (Math.abs(y) < Math.abs(stagRight)) nextY = 0;
      movePart(".ws-bg__part-" + j, nextY);
    }
  };

  var mousemoveHandler = rafThrottle(function(e) {
    var y = e.pageY;
    var x = e.pageX;
    index = Math.ceil(x / winW * bgParts);

    deltaY = y - startY;
    headingsY = textH * deltaY / winH;
    moveParts(deltaY, index);
  });

  var touchmoveHandler = rafThrottle(function(e) {
    e.preventDefault();
    var y = e.originalEvent.touches[0].pageY;
    var x = e.originalEvent.touches[0].pageX;
    index = Math.ceil(x / winW * bgParts);

    deltaY = y - startY;
    headingsY = textH * deltaY / winH;
    moveParts(deltaY, index);
  });

  var swipeEndHandler = function() {
    $(document).off("mousemove", mousemoveHandler);
    $(document).off("touchmove", touchmoveHandler);
    $(document).off("mouseup touchend", swipeEndHandler);

    if (!deltaY) return;

    if (deltaY / winH >= 0.5) navigateUp();
    if (deltaY / winH <= -0.5) navigateDown();
    changePages();
  };

  $(document).on("mousedown touchstart", ".ws-bg__part", function(e) {
    startY = e.pageY || e.originalEvent.touches[0].pageY;
    deltaY = 0;

    $(document).on("mousemove", mousemoveHandler);
    $(document).on("touchmove", touchmoveHandler);

    $(document).on("mouseup touchend", swipeEndHandler);
  });

  $(document).on("mousewheel DOMMouseScroll", function(e) {
    if (waveBlocked) return;
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
      navigateWaveUp();
    } else { 
      navigateWaveDown();
    }
  });

  $(document).on("keydown", function(e) {
    if (waveBlocked) return;
    if (e.which === 38) {
      navigateWaveUp();
    } else if (e.which === 40) {
      navigateWaveDown();
    }
  });

  $(window).on("resize", function() {
    winW = $(window).width();
    winH = $(window).height();
    changePages();
  });

});

/*-----------------------------------------------------------------------------------------*/

$(document).ready(function() {

  var curPage = 1;
  var numOfPages = $(".skw-page").length;
  var animTime = 1000;
  var scrolling = false;
  var pgPrefix = ".skw-page-";

  function pagination() {
    scrolling = true;

    $(pgPrefix + curPage).removeClass("inactive").addClass("active");
    $(pgPrefix + (curPage - 1)).addClass("inactive");
    $(pgPrefix + (curPage + 1)).removeClass("active");

    setTimeout(function() {
      scrolling = false;
    }, animTime);
  };

  function navigateUp() {
    if (curPage === 1) return;
    curPage--;
    pagination();
  };

  function navigateDown() {
    if (curPage === numOfPages) return;
    curPage++;
    pagination();
  };

  $(document).on("mousewheel DOMMouseScroll", function(e) {
    if (scrolling) return;
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
      navigateUp();
    } else { 
      navigateDown();
    }
  });

  $(document).on("keydown", function(e) {
    if (scrolling) return;
    if (e.which === 38) {
      navigateUp();
    } else if (e.which === 40) {
      navigateDown();
    }
  });

});
	
//--- Contact info ---//
	
$(document).ready(function() {
	$(".accodian-wrap").children('.accodian-items:first-child').addClass("active").children(".discription").slideDown(400);

	$(".accodian-items > .title").on("click",function(e){  
		if($(this).parents(".accodian-items").hasClass("active") && (!($(this).parent().hasClass("active")) ) ){ 
			$(this).parent().siblings().removeClass("active");
			$(this).parent().addClass("active");
			$(this).parent().siblings(".accodian-items").children(".discription").slideUp(400);
			$(this).siblings(".discription").slideDown(400); 
		}	
		else if($(this).parents(".accodian-items").hasClass("active") && $(this).parent().hasClass("active")){
			$(this).parent().removeClass("active");
			$(this).siblings(".discription").slideUp(400); 
		} 
		else if{
			$(".accodian-items > .title").parent().removeClass("active");
			$(this).parent().addClass("active");
			$(".accodian-items > .discription").slideUp(400);
			$(this).siblings(".discription").slideDown(400);
		}
		else{
			$(".accodian-items > .title-main").parent().removeClass("active");
			$(this).parent().addClass("active");
			$(".accodian-items > .discription").slideUp(400);
			$(this).siblings(".discription").slideDown(400);
		}
	});
}); 
					
					

})(jQuery);
