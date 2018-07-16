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
      // self.displayStatus("name", "alphaNumeric");
      // self.displayStatus("address", "alphaNumeric");
      // self.displayStatus("city", "alphaNumeric");
      // self.displayStatus("province", "alphaNumeric");
      // self.displayStatus("postalCode", "postalCode");
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
      if ($('select[name=attendance]').val() === "attend-ceremony-reception") {
        self.displayStatus("guest2FirstName", "alphaNumeric");
        self.displayStatus("guest2LastName", "alphaNumeric");
        self.displayStatus("guest2Meal", "dropDown");

      }
      // self.displayStatus("address", "alphaNumeric");
      // self.displayStatus("city", "alphaNumeric");
      // self.displayStatus("province", "alphaNumeric");
      // self.displayStatus("postalCode", "postalCode");
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
          $('html').css({
            overflow: 'hidden',
            height: '100%'
          });
        } else {
          $('html').css({
            overflow: 'auto',
            height: 'auto'
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
      const self = this;
      self.loadMap();
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
          infoWindow.setContent(`Miller Lash House
            <br />
            <a target="_blank" href="https://maps.google.com/maps?ll=43.779963,-79.185377&amp;z=16&amp;t=m&amp;hl=en-CA&amp;gl=CA&amp;mapclient=embed&amp;daddr=Miller%20Lash%20House%20130%20Old%20Kingston%20Rd%20Scarborough%2C%20ON%20M1E%203J5@43.7795312,-79.1846148">Get Directions</a>  
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
      var self = this;
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
      //console.log(`${$w.scrollTop()} > ${$scrollReveal.offset().top} - ${parseInt(theDragons.core.getViewportHeight())}`);
      if ((($w.scrollTop() < ($scrollReveal.offset().top - 75))) && ($w.scrollTop() > ($scrollReveal.offset().top - parseInt(theDragons.core.getViewportHeight() - 75)))) {
        $scrollReveal.css({
          transition: 'all 1s ease-in 0s',
          opacity: 1,
          transform: 'translate(0,0)'
        });
      } else {
        //console.log(`${$w.scrollTop()} > ${$scrollReveal.offset().top} - ${parseInt(theDragons.core.getViewportHeight())}`);
        $scrollReveal.css({
          transition: 'all 1s ease-in 0s',
          opacity: 0,
          transform: 'translate(0,-15px)'
        });
      }
    },
    scrollAndResizeListener: function ($scrollReveal) {
      var self = this;
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
      var self = this;
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
      var self = this;
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
      var self = this;
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
          transform: 'translate(0,-86px)'
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
      var self = this;
      $w.scroll(function () {
        self.showAndHideScrollReveal($scrollRevealNavSticky);
      });
      $w.on("resize", function () {
        self.showAndHideScrollReveal($scrollRevealNavSticky);
      });
    }
  }
});