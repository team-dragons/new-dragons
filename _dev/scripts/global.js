/*jshint esversion: 6 */

/*
 * create 'theDragons' object for entire site
 * @scope public
 */
const theDragons = (function () {
  'use strict';

  return {
    core: {
      /**
       * Gets the viewport width
       *
       * @return float
       * @scope public
       */
      getViewportWidth: function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      },
      /**
       * Gets the viewport height
       *
       * @return float
       * @scope public
       */
      getViewportHeight: function () {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      },
      /**
       * Extend the theDragons object
       *
       * @param string namespace
       * @param object namespaceModule
       */
      extend: function (namespace, namespaceModule) {
        if (theDragons[namespace] === undefined) {
          theDragons[namespace] = namespaceModule();
          if (theDragons[namespace] !== undefined) {
            if (typeof theDragons[namespace].initialize === 'function') {
              theDragons[namespace].initialize();
            }
            if (typeof theDragons[namespace].ready === 'function') {
              $(function () {
                theDragons[namespace].ready();
              });
            }
            return theDragons[namespace];
          }
        } else {
          theDragons.core.throwException('Cannot extend "${namespace}" to theDragons. The name space "${namespace}" already exists');
        }
      }
    }
  };
})();

/*
* Allows the height of various divs to be the same by taking the biggest height and applying it to all items.
* This will occur for any item regardless of viewport. To affect medium size and up, see Options.
*
* How to use this:
* Add 'data-equalize-height="(key)"' to any item where key is a value you input yourself, to link the items.
* All the items with the same 'key' will have the same height
*
* Options:
* If you only want this to occur on medium size up, add 'data-equalize-medium-up' to the item as well
*/
theDragons.core.extend('equalizeHeights', function () {
  'use strict';

  let _dataEqualHeightArray = [];
  let _highest = 0;
  let _heights = [];

  /*
   * Sorts items in array from smallest to largest
   */
  let sortNumber = function (a, b) {
    return a - b;
  };

  /*
   * For each "key", determine the largest height and apply to all items with that key
   */
  let maxHeight = function () {
    $.each(_dataEqualHeightArray, function (index, value) {
      _highest = 0;
      _heights = [];
      $('[data-equalize-height=' + value + ']').css('height', 'auto');
      $('[data-equalize-height=' + value + ']').each(function () {
        /* get the height including the padding of an item */
        _heights.push($(this).outerHeight());
      });
      _heights = _heights.sort(sortNumber).reverse();
      _highest = _heights[0];
      $('[data-equalize-height=' + value + ']').css('height', _highest);
    });
  };

  return {
    initialize: function () {
      const self = this;
      self.getDataEqualHeightItems();
      self.resizeListener();
    },
    /*
     * Checks all the items that need to equalize height, and add keys to array
     */
    getDataEqualHeightItems: function () {
      $('[data-equalize-height]').each(function () {
        let newItem = $(this).data('equalize-height');
        if (_dataEqualHeightArray.indexOf(newItem) < 0) {
          _dataEqualHeightArray.push(newItem);
        }
      });
    },
    /*
     * Re-evaluate the equalizing of the height when the page loads or is resized
     */
    resizeListener: function () {
      const self = this;
      $(window).on('load resize', function (event) {
        self.forceResize();
      });
    },
    /*
     * Check for any new items to equalize, and then equalize them
     * Do not equalize height for small size if the item contains [data-equalize-medium-up] data attribute
     */
    forceResize: function () {
      const self = this;
      self.getDataEqualHeightItems();
      maxHeight();
      if (theDragons.core.getViewportWidth() < 640) {
        $('[data-equalize-height][data-equalize-medium-up]').css('height', 'auto');
      }
      if (theDragons.core.getViewportWidth() >= 640) {
        $('[data-equalize-height][data-equalize-small-only]').css('height', 'auto');
      }
    }
  };
});

theDragons.core.extend('formValidation', function () {
  'use strict';
  return {
    //checkField(): form validation based on input type
    //@param {string} elementName is the name of the form element being checked
    //@param {string} type is the character set to test (e.g. alphaNumeric, numeric, email, postalCode)
    //@returns true to show an error
    //@returns false to hide an error
    checkField: function (elementName, type) {
      let itemSelected = false;
      let $element = $("[name=" + elementName + "]"); //returns array, $element gets first $element
      let $val = $element.val();
      if (type == "radioButton" || type == "checkBox") {
        for (i = 0; i < $element.length; i++) {
          if ($element[i].checked) {
            itemSelected = true;
          }
        }
        if (!itemSelected) {
          for (i = 0; i < $element.length; i++) {
            return true;
          }
        } else {
          return false;
        }
      } else if (type == "dropDown") {
        if ($element) {
          $val = $("[name=" + elementName + "] option:selected").val();
          if ($val == "" || !(this.isValueValid("alphaNumeric", $val)))
            return true;
          else
            return false;
        }
      } else { //input boxes, email, postcalcode
        if ($element) {
          if ($val == "" || !(this.isValueValid(type, $val)))
            return true;
          else
            return false;
        }
      }
    },
    //isValueValid(): returns true if value successfully tested again regex
    //@param {string} type is the character set to test (e.g. alphaNumeric, numeric, email, postalCode)
    //@param {string} value is the value being tested
    isValueValid: function (type, value) {
      let regex;
      switch (type) {
        case "alphaNumeric": // alphaNumeric + french characters
          regex = /^[A-Za-z\u00E0-\u00FC0-9 ]/;
          break;
        case "numeric": // numbers
          regex = /^\d+$/;
          break;
        case "email": //email
          regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          break;
        case "postalCode": //postal code
          regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
          break;
        case "zipCode": //zip code
          regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
          break;
      }
      return regex.test(value);
    }
  }
});

theDragons.core.extend('formSaveOurDate', function () {
  let errormessage = "";
  return {
    ready: function () {
      const self = this;
      self.submitListener();
    },
    //validateForm(): returns true when all fields are validated successfuly
    validateForm: function () {
      const self = this;
      errormessage = "";
      if (errormessage != "") {
        return false;
      }
      return true;
    },
    //displayStatus(): highlights/hides the border of the input that has an issue + adds/hides the error message; this function is customizable
    //@param {string} elementName is the name of the DOM object being tested - used here for 'error-message'  
    //@param {string} type is the character set to be validated again (e.g. alphaNumeric, numeric, email, postalCode, dropDown, checkBox, radioButton)
    displayStatus: function (elementName, type) {
      if (theDragons.formValidation.checkField(elementName, type)) {
        $("." + elementName + ".error-message").addClass("active");
        errormessage += elementName + " ";
      } else {
        $("." + elementName + ".error-message.active").removeClass("active");
      }
    },
    submitListener: function () {
      const self = this;
      $('form[name=save-our-date]').submit(function (ev) {
        //console.log(this);
        ev.preventDefault(); // to stop the form from submitting
        if (self.validateForm()) { // if all the validations succeeded
          let name = $("input[name='name']").val();
          let address = $("input[name='address']").val();
          let city = $("input[name='city']").val();
          let province = $("input[name='province']").val();
          let postalCode = $("input[name='postalCode']").val();
          let optional = $("textarea[name='optional']").val();
          $(".form").hide();
          $(".thank-you").fadeIn();
          $.ajax({
            url: `/save-our-date/submit-data.php?name=${name}&address=${address}&city=${city}&province=${province}&postalCode=${postalCode}&optional=${optional}`
          });
          //this.submit();
        }
      });
    }
  }
});

theDragons.core.extend('formRSVP', function () {
  let errormessage = "";
  return {
    ready: function () {
      if (window.location.pathname === "/rsvp/") {
        const self = this;
        self.addEventListeners();
        self.submitListener();
      }
    },
    //validateForm(): returns true when all fields are validated successfuly
    validateForm: function () {
      const self = this;
      errormessage = "";
      self.displayStatus("guest1FirstName", "alphaNumeric");
      self.displayStatus("guest1LastName", "alphaNumeric");
      self.displayStatus("attendance", "dropDown");
      if (errormessage != "") {
        return false;
      }
      return true;
    },
    //displayStatus(): highlights/hides the border of the input that has an issue + adds/hides the error message; this function is customizable
    //@param {string} elementName is the name of the DOM object being tested - used here for 'error-message'  
    //@param {string} type is the character set to be validated again (e.g. alphaNumeric, numeric, email, postalCode, dropDown, checkBox, radioButton)
    displayStatus: function (elementName, type) {
      if (theDragons.formValidation.checkField(elementName, type)) {
        $("." + elementName + ".error-message").addClass("active");
        errormessage += elementName + " ";
      } else {
        $("." + elementName + ".error-message.active").removeClass("active");
      }
    },
    addEventListeners: function () {
      const self = this;
      $('select[name=attendance]').on("change",function (ev) {
        $(".attendance.error-message").removeClass("active");
        if (this.value === "attend-ceremony-reception") {
          $(".attend-ceremony-reception").fadeIn();
          $(".not-attend").hide();
        } else if (this.value === "not-attend") {
          $(".attend-ceremony-reception").hide();
          $(".not-attend").fadeIn();
        }
      });
      $('.meal').on("change", function (ev) {
        if (this.value === "children" || this.value === "none") {
          $(".high-chairs").fadeIn();
        }
      });
    },
    submitListener: function () {
      const self = this;
      $('form[name=rsvp]').submit(function (ev) {
        ev.preventDefault(); // to stop the form from submitting
        if (self.validateForm()) { // if all the validations succeeded
          this.submit();
        }
      });
    }
  }
});

// Open/Close Hamburger menu and Disable/Enable scroll
theDragons.core.extend('hamburgerMenu', function () {
  return {
    initialize: function () {
      const self = this;
      self.addEventListeners();
    },
    addEventListeners: function (){
      $('#nav-icon').click(() => {
        $('nav.container').toggleClass('active-nav');
        $('div.logo-menu-container').toggleClass('hide-for-small-only');
      });
      $('.logo-menu-container ul li a').click(() => {
        $('div.logo-menu-container').removeClass('active-nav');
        $('#nav-icon').removeClass('open');
      });
      $('#nav-icon').click(function () {
        $(this).toggleClass('open');
        if ($('#nav-icon').hasClass('open')) {
          $('body').css({
            "position":'fixed',
            "overflow-y":'scroll'
          });
        } else {
          $('html').css({
            "position": 'static',
            "overflow-y": 'auto'
          });
        }
      });
    }
  }
});

theDragons.core.extend('smoothScroll', function () {
  return {
    initialize: function () {
      const self = this;
      self.addEventListeners();
    },
    addEventListeners: function () {
      $("a").on('click', function (e) {
        if (this.hash !== "") {
          e.preventDefault();
          const hash = this.hash;
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 800, function () {
            window.location.hash = hash;
          });
        }
      });
    }
  }
});

theDragons.core.extend('loadMap', function() {
  const app = {};
  
  return {
    initialize: function () {
      if (window.location.pathname === "/" || window.location.pathname === "/faqs/") {
        const self = this;
        self.loadMap();
      }
    },
    loadMap: function (lat = 43.7799664, lng = -79.1875656) {
      const mapOptions = {
        center: {
          lat,
          lng
        },
        zoom: 13,
        styles: [
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "hue": "#FFBB00"
              },
              {
                "saturation": 43.400000000000006
              },
              {
                "lightness": 37.599999999999994
              },
              {
                "gamma": 1
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "hue": "#00FF6A"
              },
              {
                "saturation": -1.0989010989011234
              },
              {
                "lightness": 11.200000000000017
              },
              {
                "gamma": 1
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          },
          {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{
                "hue": "#FFC200"
              },
              {
                "saturation": -61.8
              },
              {
                "lightness": 45.599999999999994
              },
              {
                "gamma": 1
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [{
                "hue": "#FF0300"
              },
              {
                "saturation": -100
              },
              {
                "lightness": 51.19999999999999
              },
              {
                "gamma": 1
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [{
                "hue": "#FF0300"
              },
              {
                "saturation": -100
              },
              {
                "lightness": 52
              },
              {
                "gamma": 1
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "hue": "#0078FF"
              },
              {
                "saturation": -13.200000000000003
              },
              {
                "lightness": 2.4000000000000057
              },
              {
                "gamma": 1
              }
            ]
          }
        ]
      }

      const mapDiv = $('.map')[0];
      app.map = new google.maps.Map(mapDiv, mapOptions);
      const millerLashHouse = new google.maps.Marker({
        position: new google.maps.LatLng(43.779872, -79.185280),
        map: app.map,
        icon: `/images/pin.png`
      });

      const infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(millerLashHouse, 'click', function () {
        infoWindow.setContent(`Miller Lash House<br><a target="_blank" href="https://maps.google.com/maps?ll=43.779963,-79.185377&amp;z=16&amp;t=m&amp;hl=en-CA&amp;gl=CA&amp;mapclient=embed&amp;daddr=Miller%20Lash%20House%20130%20Old%20Kingston%20Rd%20Scarborough%2C%20ON%20M1E%203J5@43.7795312,-79.1846148">Get Directions</a>  
        `);
        infoWindow.open(app.map, millerLashHouse);
      });
    
    }
  }
});

theDragons.core.extend('scrollReveal', function () {
  $w = $(window);
  return {
    initialize: function () {
      const self = this;
      if ($.find('.scroll-reveal').length > 0) {
        $('.scroll-reveal').each(function () {
          $scrollReveal = $(this);
          $scrollReveal.css({
            opacity: 1
          });
          self.showAndHideScrollReveal($scrollReveal);
          self.scrollAndResizeListener($scrollReveal);
        });
      }
    },
    showAndHideScrollReveal: function ($scrollReveal) {
      let offset = 0;     
      if (theDragons.core.getViewportWidth() <= 640) {
        offset = 0;
      } else {
        offset = 120;
      }
      //console.log(`${$w.scrollTop()} > ${$scrollReveal.offset().top} - ${parseInt(theDragons.core.getViewportHeight())}`);
      if ((($w.scrollTop() < ($scrollReveal.offset().top - offset))) && ($w.scrollTop() > ($scrollReveal.offset().top - parseInt(theDragons.core.getViewportHeight() - offset-30)))) {
        $scrollReveal.css({
          transition: 'all 0.25s ease-in 0s',
          opacity: 1,
          transform: 'translate(0,0)'
        });
      } else {
        //console.log(`${$w.scrollTop()} > ${$scrollReveal.offset().top} - ${parseInt(theDragons.core.getViewportHeight())}`);
        $scrollReveal.css({
          transition: 'all 0.25s ease-in 0s',
          opacity: 0,
          transform: 'translate(0,-15px)'
        });
      }
    },
    scrollAndResizeListener: function ($scrollReveal) {
      const self = this;
      $w.scroll(function () {
        self.showAndHideScrollReveal($scrollReveal);
      });
      $w.on("resize", function() {
        self.showAndHideScrollReveal($scrollReveal);
      });
    }
  }
});

theDragons.core.extend('scrollHideNav', function () {
  $w = $(window);
  return {
    initialize: function () {
      const self = this;
      const windowWidth = $(document).width();
      if ($.find('.scroll-hide-nav').length > 0 && windowWidth >= 640) {
        $scrollHideNav = $('.scroll-hide-nav');
        $scrollHideNav.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 1
        });
        self.showAndHideScrollReveal($scrollHideNav);
        self.scrollAndResizeListener($scrollHideNav);
      }
    },
    showAndHideScrollReveal: function ($scrollHideNav) {
      if ($w.scrollTop() < 80) {
        $scrollHideNav.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 1,
        });
      } else {
        $scrollHideNav.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 0,
        });
      }
    },
    scrollAndResizeListener: function ($scrollHideNav) {
      const self = this;
      $w.scroll(function () {
        self.showAndHideScrollReveal($scrollHideNav);
      });
      $w.on("resize", function () {
        self.showAndHideScrollReveal($scrollHideNav);
      });
    }
  }
});

theDragons.core.extend('scrollRevealSticky', function () {
  $w = $(window);
  return {
    initialize: function () {
      const self = this;
      if ($.find('.scroll-reveal-nav-sticky').length > 0) {
        $scrollRevealNavSticky = $('.scroll-reveal-nav-sticky');
        $scrollRevealNavSticky.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 0,
        });
        self.showAndHideScrollReveal($scrollRevealNavSticky);
        self.scrollAndResizeListener($scrollRevealNavSticky);
      }
    },
    showAndHideScrollReveal: function ($scrollRevealNavSticky) {
      if ($w.scrollTop() < 150) {
        $scrollRevealNavSticky.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 0,
          transform: 'translate(0,-90px)'
        });
      } else {
        $scrollRevealNavSticky.css({
          transition: 'all 0.5s ease-in 0s',
          opacity: 1,
          transform: 'translate(0,0)'
        });
      }
    },
    scrollAndResizeListener: function ($scrollRevealNavSticky) {
      const self = this;
      $w.scroll(function () {
        self.showAndHideScrollReveal($scrollRevealNavSticky);
      });
      $w.on("resize", function () {
        self.showAndHideScrollReveal($scrollRevealNavSticky);
      });
    }
  }
});