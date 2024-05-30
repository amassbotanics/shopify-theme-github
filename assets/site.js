(function ($) {
  // Blob Modal Plugin

  function openBlobModal($modal) {
    $modal.addClass("blob-modal--show");
  }

  function closeBlobModal($modal) {
    $modal.removeClass("blob-modal--show");
  }

  function addBlobCloseListener($modal) {
    $modal.find(".js-blob-modal-close").on("click", function (e) {
      e.preventDefault();
      closeBlobModal($modal);
    });
  }

  function closeBlobOnOverlayClick($modal) {
    $(document).on("click", function (e) {
      if ($(e.target).is($modal)) {
        closeBlobModal($modal);
      }
    });
  }

  $.fn.blobModal = function (options) {
    var settings = $.extend(
      {
        overlayClose: true,
      },
      options
    );

    return this.each(function () {
      var overlayClose = settings.overlayClose;
      var $modalTrigger = $(this);
      var modalId = $modalTrigger.attr("href");
      var $modal = $(modalId);

      $modalTrigger.on("click", function (e) {
        e.preventDefault();
        openBlobModal($modal);
      });

      if (overlayClose == true) {
        closeBlobOnOverlayClick($modal);
      }

      addBlobCloseListener($modal);
    });
  };

  $.extend({
    blobModal: function (el) {
      var $modal = $(el);
      openBlobModal($modal);
      addBlobCloseListener($modal);
    },
  });
  // Initialize Modal Plugin and  set storage
  if (!localStorage || !localStorage.getItem("ageGateModalShown")) {
    $.blobModal(".js-blob-modal");
  } else {
    localStorage.setItem("ageGateModalShown", true);
  }

  $(".js-over-21").on("click", function (e) {
    e.preventDefault();
    localStorage.setItem("ageGateModalShown", true);
  });

  //corporate gifting download cta
  $(".js-gifting-page-cta-download").on("click", function (e) {
    e.preventDefault();
    $(".gifting-form__content-wrap").toggleClass(
      "gifting-form__content-wrap--active"
    );
  });

  //corporate gifting page capture UTM parameters on form submission
  var queryForm = function (settings) {
    var reset = settings && settings.reset ? settings.reset : false;
    var self = window.location.toString();
    var querystring = self.split("?");
    if (querystring.length > 1) {
      var pairs = querystring[1].split("&");
      for (i in pairs) {
        var keyval = pairs[i].split("=");
        if (reset || sessionStorage.getItem(keyval[0]) === null) {
          sessionStorage.setItem(
            "contact[" + keyval[0] + "]",
            decodeURIComponent(keyval[1])
          );
        }
      }
    }
    var hiddenFields = document.querySelectorAll(
      "input[type=hidden], input[type=text]"
    );
    for (var i = 0; i < hiddenFields.length; i++) {
      var param = sessionStorage.getItem(hiddenFields[i].name);
      if (param)
        document.getElementsByName(hiddenFields[i].name)[0].value = param;
    }
  };

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return null;
  }

  $(document).ready(function () {
    //corporate gifting initialize
    queryForm();
    //testimonials
    $(".js-press-quote-slides").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 3000,
      infinite: true,
      responsive: [
        {
          breakpoint: 760,
          settings: {
            asNavFor: ".js-press-logo-slides",
          },
        },
      ],
    });
    $(".js-press-logo-slides").slick({
      slidesToShow: 5,
      arrows: false,
      asNavFor: ".js-press-quote-slides",
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 760,
          settings: {
            slidesToShow: 1,
            dots: true,
          },
        },
      ],
    });
    $(".js-press-quote-slides").on(
      "beforeChange",
      function (event, slick, slide, nextSlide) {
        $(".js-press-logo-slides")
          .find(".slick-slide")
          .removeClass("slick-current")
          .eq(nextSlide)
          .addClass("slick-current");
      }
    );

    //static pages
    $(".js-press-quote-slides-static").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 3000,
      infinite: true,
      asNavFor: ".js-press-logo-slides-static",
    });
    $(".js-press-logo-slides-static").slick({
      slidesToShow: 1,
      dots: true,
      arrows: false,
      asNavFor: ".js-press-quote-slides-static",
      focusOnSelect: true,
    });

    //customer reviews
    $(".customer-reviews-carousel").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      arrows: true,
      prevArrow: $(".customer-reviews-previous"),
      nextArrow: $(".customer-reviews-next"),
      responsive: [
        {
          breakpoint: 969,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          },
        },
      ],
    });

    var recipe = getQueryVariable("recipe");

    //cocktail pdp section
    if (recipe) {
      // Move to top section
      $("#shopify-section-static-product").before(
        $("#shopify-section-static-cocktail-recipes")
      );
      $(".cocktails-section").removeClass("show-border");
      $(".cocktails-section").addClass("bottom-border");

      // Hide breadcrumb
      $(".breadcrumb-navigation").hide();
    }

    $(".cocktail-slider .cocktail-slider__item").each(function () {
      if (
        $(this)
          .attr("name")
          .replace(/[^\w\s]/gi, "")
          .indexOf(recipe) !== -1
      ) {
        $(".cocktail-slider").prepend($(this));
      } else if ($(this).hasClass("partnership")) {
        $(this).remove();
      }
    });

    $(".cocktail-slider").slick({
      infinite: true,
      lazyload: "ondemand",
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: $(".cocktail-slider-previous"),
      nextArrow: $(".cocktail-slider-next"),
    });

    //cocktail alternate pdp section

    if (recipe) {
      // Move to top section
      $("#shopify-section-static-product-alternate").before(
        $("#shopify-section-static-cocktail-recipes-alternate")
      );
      $("#shopify-section-static-product").before(
        $("#shopify-section-static-cocktail-recipes-alternate")
      );
      $(".cocktail-alternate__section").addClass("bottom-border");

      // Hide breadcrumb
      $(".breadcrumb-navigation").hide();
    }

    $(
      ".js-cocktail-alternate-slider .cocktail-alternate__slider-item-wrap"
    ).each(function () {
      if (
        $(this)
          .attr("name")
          .replace(/[^\w\s]/gi, "")
          .indexOf(recipe) !== -1
      ) {
        $(".js-cocktail-alternate-slider").prepend($(this));
      } else if ($(this).hasClass("partnership")) {
        $(this).remove();
      }
    });

    $(".js-cocktail-alternate-slider").slick({
      infinite: true,
      lazyload: "ondemand",
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: $(".js-cocktail-alternate-slider-previous"),
      nextArrow: $(".js-cocktail-alternate-slider-next"),
      responsive: [
        {
          breakpoint: 1300,
          settings: {
            adaptiveHeight: true,
          },
        },
      ],
    });

    /**
     * Adjust the height of the slider according to the active item
     */
    $(".js-cocktail-alternate-slider").on(
      "init afterChange lazyLoaded",
      function () {
        var heightActiveSlider = $(
          ".js-cocktail-alternate-slider .cocktail-alternate__slider-item-wrap.slick-active"
        ).height();
        setTimeout(() => {
          $(".js-cocktail-alternate-slider .slick-list").height(
            heightActiveSlider
          );
        });
      }
    );

    //nutrition facts popup
    $(".js-nutrition-bind-click").on(
      "click",
      ".js-nutrition-button",
      function () {
        $(".nutrition-modal").addClass("active");
      }
    );
    $(".js-nutrition-modal-close").on("click", function () {
      $(".nutrition-modal").removeClass("active");
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".nutrition-modal")) {
        $(".nutrition-modal").removeClass("active");
      }
    });

    // pxs announcement banner slider
    $(".pxs-announcement-bar-slider").slick({
      slidesToShow: 1,
      autoplay: true,
      arrows: false,
      autoplaySpeed: 5000,
      // fade: true,
      // adaptiveHeight: true
    });
    //pxs announcement banner modal 
    $(".js-announcement-banner-open").on("click", function (e) {
      e.preventDefault();
    });

    //PDP botanical carousel section
    $(".js-product-botanic-image-list-description-slider").slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: ".js-product-botanic-image-list-image-slider"
    });
    $(".js-product-botanic-image-list-image-slider").slick({
      infinite: false,
      slidesToShow: 5,
      arrows: false,
      asNavFor: ".js-product-botanic-image-list-description-slider",
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: $(".js-product-botanic-image-list-item-previous"),
            nextArrow: $(".js-product-botanic-image-list-item-next"),
          }
        },
      ],
    })

    //Subscription Product Subscribe Button Open Mini Cart
    if (window.location.href.indexOf("openMiniCart") > -1) {
      $('.mini-cart-wrap').click();
    }

    //Dynamic Cocktail Blog Mobile Carousel
    $(".js-cocktail-blog-slider").slick({
      mobileFirst: true,
      arrows: true,
      prevArrow: $(".js-cocktail-mobile-slider-arrow-prev"),
      nextArrow: $(".js-cocktail-mobile-slider-arrow-next"),
      responsive: [
        {
          breakpoint: 4000,
          settings: "unslick"
        },
        {
          breakpoint: 2000,
          settings: "unslick"
        },
        {
          breakpoint: 1600,
          settings: "unslick"
        },
        {
          breakpoint: 1024,
          settings: "unslick"
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });


  });

  // variant-option select on product page
  $(".option-value-input").on("change", function () {
    $(".variant-option-text").removeClass("variant-option-text--show");
    $("[data-variant-name='" + this.value + "']").addClass(
      "variant-option-text--show"
    );
  });
  function showVariantDisclaimer() {
    if ($(".option-value-input:checked").length) {
      var selectedVariantDisclaimer = $(".option-value-input:checked").val();
      $(".variant-option-text").removeClass("variant-option-text--show");
      $("[data-variant-name='" + selectedVariantDisclaimer + "']").addClass(
        "variant-option-text--show"
      );
    }
  }
  showVariantDisclaimer();

  // country location modal
  $(".location-modal__button__yes").on("click", function (event) {
    event.preventDefault();

    $(".location-modal, .location-modal__content").removeClass("active");
    localStorage.setItem("user-location", "uk");
    localStorage.setItem("locationModalShown", true);

    $.post("/cart/update.js", { currency: "GBP" }, function () {
      location.reload();
    });
  });

  $(".location-modal__button__no").on("click", function (event) {
    event.preventDefault();

    $(".location-modal, .location-modal__content").removeClass("active");
    localStorage.setItem("locationModalShown", true);

    $.post("/cart/update.js", { currency: "USD" }, function () {
      location.reload();
    });
  });

  function showLocationModal() {
    $(".location-modal, .location-modal__content").addClass("active");
  }

  // currency selector
  $(".js-currency-dropdown-item").click(function () {
    var $selectedCurrencyItem = $(this);
    var currencyValue = $selectedCurrencyItem.attr("data-currency-value");

    var $currencySelect = $(".js-currency-select");
    $currencySelect.val(currencyValue);

    $currencySelect[0].dispatchEvent(new Event("change"));

    $(".currency-dropdown__content").toggle();
  });

  $(".currency-dropdown__btn").click(function (event) {
    $(".currency-dropdown__content").toggle();
    event.stopPropagation();
  });

  $(document).click(function () {
    $(".currency-dropdown__content").hide();
  });

  function showCurrencySelector() {
    $(".js-currency-dropdown").addClass("currency-dropdown--visible");
  }

  function selectAlcoholState() {
    var userRegion = localStorage.getItem("user-region");

    if (userRegion && $("#locationSelect").length) {
      $("#locationSelect option:contains('" + userRegion + "')").attr(
        "selected",
        "selected"
      );

      if (
        $("#locationSelect option:contains('" + userRegion + "')").length === 0
      ) {
        $("#locationSelect").addClass("error");
        $("#locationSelect").on("change", function () {
          $("#locationSelect").removeClass("error");
          $('form[action="/cart/add"] button.submit')
            .removeAttr("disabled", "")
            .removeClass("disabled");
          $("#shipping-error-msg").html("");
        });
        $("#shipping-error-msg").html(`
          <p>We currently do not ship to ${userRegion}.</p>
          <p>Please use our <a href="https://amass.com/pages/find-us">store locator</a> to see other purchase options in your area.</p>
        `);
        $('form[action="/cart/add"] button.submit')
          .attr("disabled", "disabled")
          .addClass("disabled");
      }
    }
  }

  // detect visitor location
  if (!localStorage || !localStorage.getItem("locationModalShown")) {
    // Handler for uk store
    if (window.location.hostname === "uk.amass.com") {
      showCurrencySelector();
      setTimeout(function () {
        showLocationModal();
      }, 6000);
      return;
    }

    $.get(
      "http://ipwhois.pro/json/?key=O52MacI6RlpdKBoI",
      function (response) {
        let userCountry = response.country_code;
        localStorage.setItem("user-region", response.region);
        if (userCountry != "US") {
          showCurrencySelector();
          setTimeout(function () {
            showLocationModal();
          }, 6000);
        } else {
          localStorage.setItem("locationModalShown", true);
        }
        selectAlcoholState();
      },
      "jsonp"
    );
  } else {
    selectAlcoholState();
  }

  // media landing template link to product within page
  $(".js-landing-cta").click(function (e) {
    e.preventDefault();
    var landingCta = $(this).attr("href");
    var headerHeight = $(".header-minimal").height();
    $("html,body").animate({
      scrollTop: $(landingCta).offset().top - headerHeight,
    });
  });

  $(".js-afterdream-label").click(function (e) {
    e.preventDefault();
    var selectedAfterdreamLabel = $(this).attr("data-id");
    $(".js-afterdream-label").removeClass("active");
    $(this).addClass("active");
    $(".js-afterdream-details").removeClass("js-afterdream-details--show");
    $("#" + selectedAfterdreamLabel).addClass("js-afterdream-details--show");
  });

  //afterdream modal
  function showAfterdreamModal() {
    $(".js-afterdream-modal").addClass("active");
  }

  if (!localStorage || !localStorage.getItem("afterdreamModalShown")) {
    showAfterdreamModal();
  } else {
    localStorage.setItem("afterdreamModalShown", true);
  }

  $(".js-afterdream-yes").click(function (e) {
    e.preventDefault();
    $(".js-afterdream-modal").removeClass("active");
    localStorage.setItem("afterdreamModalShown", true);
  });

  //reorder button on account page Reorder History
  $(".js-reorder-button").on("click", function (e) {
    e.preventDefault();
    var reorderId = $(this).attr("href");
    $(this).toggleClass("order-history__reorder-cta--active");
    $("#" + reorderId).toggleClass("reorder--active");
    $("#" + reorderId).toggle();
  });
  //default select checkbox for reorder items
  $(".order-history__reorder-item-checkbox input").prop("checked", true);
  //add to cart on account page under reorder button
  this.reorder = new (function () {
    var self = this;

    this.pushQueue = function (i, data, el, isCheckout) {
      //LOW STOCK -- add as many as possible if stock is below requested amount
      if (data[i].check_inventory) {
        data[i].quantity = Math.min(
          parseInt(data[i].inventory),
          parseInt(data[i].quantity)
        );
      }

      $.ajax({
        url: "/cart/add.js",
        method: "POST",
        data: {
          quantity: data[i].quantity,
          id: data[i].id,
        },
        complete: function (res) {
          if (i >= data.length - 1) {
            if (isCheckout) {
              window.location.href = "/checkout";
            } else {
              window.location.href = "/cart";
            }
            return;
          } else {
            self.pushQueue(i + 1, data, el, isCheckout);
          }
        },
      });
    };

    this.reorderListener = function (el) {
      var $el = $(this);
      var data = [];
      var isCheckout = $el.data("is-checkout");
      console.log("isCheckout", $el.data("is-checkout"));
      $el
        .closest(".reorder--active")
        .find(".reorder-product-item:checked")
        .each(function () {
          var reorderProductData = $(this).data();
          data.push({
            id: reorderProductData.id,
            quantity: reorderProductData.quantity,
            inventory: reorderProductData.inventory,
            check_inventory:
              reorderProductData.inventoryPolicy == "deny" &&
              reorderProductData.inventoryTracker != "",
          });
        });
      $el.addClass("addtocart-button-loading");
      self.pushQueue(0, data, $el, isCheckout);
    };

    this.init = function () {
      $(".js-add-to-cart-btn, .js-reorder-checkout-btn").on(
        "click",
        self.reorderListener
      );
    };
  })();

  $(reorder.init);

  // Corporate gifting & wedding save data on Google Sheets
  $("#contact_form").submit(function () {
    const formData = $("#contact_form")
      .serializeArray()
      .reduce((data, item) => ({ ...data, [item.name]: item.value }), {});

    if (
      formData["contact[emailType]"] === "Amass Corporate Gifting" ||
      formData["contact[emailType]"] === "Amass Weddings"
    ) {
      $.ajax({
        type: "POST",
        url: "https://p9q5ruoxck.execute-api.us-west-1.amazonaws.com/dev/track",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      });
    }
  });
  // Cart Mini Updates
  $(window).on("load", function () {
    function getOrderItemObj(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == value) return arr[i];
      }
    }
    function giftNoteTextareaResize($el) {
      var giftNoteTextAreaHeightBuffer = 30;
      // var $giftNoteTextArea = $('.cart-mini-note__message-textarea');
      var giftNoteTextAreaVal = $el.val();
      var $giftNoteTextAreaClone = $(
        '<div class="cart-mini-note__message-textarea--clone">' +
        giftNoteTextAreaVal +
        "</div>"
      );

      $giftNoteTextAreaClone.insertAfter($el);

      var $newGiftNoteTextAreaClone = $(
        ".cart-mini-note__message-textarea--clone"
      );
      var giftNoteTextAreaCloneHeight =
        $newGiftNoteTextAreaClone.height() + giftNoteTextAreaHeightBuffer;
      $newGiftNoteTextAreaClone.remove();
      $el.css({ height: giftNoteTextAreaCloneHeight });
    }
    function giftNoteResetTextAreaHeight($el) {
      // var $giftNoteTextArea = $('.cart-mini-note__message-textarea');
      $el.css({ height: "" });
    }
    function updateGiftNoteTextCount($el) {
      var characterCount = $el.val().length;
      current_count = $(".cart-mini-note__text-count-current");
      current_count.text(characterCount);
    }
    function giftNoteSavedState($el) {
      var $giftNoteTextarea = $("#CartNote");
      $el.text("Edit Message");
      $(".cart-mini-note__text-count").addClass(
        "cart-mini-note__text-count--hide"
      );
      $giftNoteTextarea.addClass(
        "cart-mini-note__message-textarea--uneditable"
      );
      $giftNoteTextarea.attr("readonly", "readonly");
      sessionStorage.setItem(
        "cart_mini_gift_note_message",
        $giftNoteTextarea.val()
      );
      giftNoteTextareaResize($giftNoteTextarea);
    }
    function giftNoteEditState($el) {
      var $giftNoteTextarea = $("#CartNote");
      $el.text("Save Message");
      $(".cart-mini-note__text-count").removeClass(
        "cart-mini-note__text-count--hide"
      );
      $giftNoteTextarea.removeClass(
        "cart-mini-note__message-textarea--uneditable"
      );
      $giftNoteTextarea.removeAttr("readonly");
      updateGiftNoteTextCount($giftNoteTextarea);
      giftNoteResetTextAreaHeight($giftNoteTextarea);
    }

    function checkGiftNote() {
      var $giftNoteTextArea = $("#CartNote");
      var storedGiftNote = sessionStorage.getItem(
        "cart_mini_gift_note_message"
      );
      if (!$giftNoteTextArea.val() && storedGiftNote) {
        $giftNoteTextArea.val(storedGiftNote);
        giftNoteSavedState($(".js-note-message-save"));
      }
    }
    // Gift Note Character Count
    $(".js-cart-mini-bind-click").on("keyup", "#CartNote", function () {
      updateGiftNoteTextCount($(this));
    });

    // Mini Cart Sample Product Checkbox
    $(".js-cart-mini-bind-click").on("change", "#cartMiniSample", function () {
      if ($("#cartMiniSample").is(":checked")) {
        $(".cart-mini-sample__product-wrap").addClass(
          "cart-mini-sample__product-wrap--show"
        );
      } else {
        $(".cart-mini-sample__product-wrap").removeClass(
          "cart-mini-sample__product-wrap--show"
        );
      }
    });

    // Mini Cart Gift Note Checkbox
    $(".js-cart-mini-bind-click").on(
      "change",
      "#cartMiniGiftNote",
      function () {
        if ($("#cartMiniGiftNote").is(":checked")) {
          $(".cart-mini-note__message-wrap").addClass(
            "cart-mini-note__message-wrap--show"
          );
          checkGiftNote();
        } else {
          $(".cart-mini-note__message-wrap").removeClass(
            "cart-mini-note__message-wrap--show"
          );
          $("#CartNote").val("");
        }
      }
    );

    // Gift Note Message Save
    $(".js-cart-mini-bind-click").on(
      "click",
      ".js-note-message-save",
      function (e) {
        e.preventDefault();
        if ($(this).text() === "Save Message") {
          giftNoteSavedState($(this));
        } else {
          giftNoteEditState($(this));
        }
      }
    );

    // Mini Cart quantity selector
    $(".js-cart-mini-bind-click").on(
      "click",
      ".js-cart-mini-item-adjust-quantity",
      function () {
        var $el = $(this);
        var operator = $el.data("cart-item-operator");
        var quantityAdjustmentAmount = -1;
        var $quantityEl = $el
          .closest(".cart-mini-item-quantity__wrap")
          .find(".cart-mini-item-quantity");
        var currentQuantity = parseInt($quantityEl.html());
        var productID = $quantityEl.data("cart-item-product-id");
        var $productPriceEl = $el
          .closest(".cart-mini-item-details-footer")
          .find(".cart-mini-item-final-price");

        if (operator === "plus") {
          quantityAdjustmentAmount = 1;
        }
        var newQuantity = currentQuantity + quantityAdjustmentAmount;
        $quantityEl.html(newQuantity);
        $(
          '.js-cart-mini-item-adjust-quantity[data-cart-item-operator="minus"]'
        ).prop("disabled", newQuantity === 1);

        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: { quantity: newQuantity, id: productID },
          dataType: "json",
          complete: function (res) {
            var data = res.responseJSON;
            var orderItem = getOrderItemObj(data.items, productID);
            $productPriceEl.html("$" + orderItem.final_line_price / 100);
            $(".cart-mini-subtotal-value")
              .attr("data-cart-cents", data.total_price)
              .html("$" + Math.round(data.total_price / 100));
            updateMiniCartFreeShippingBanner();
            validateMiniCartSampleProduct();
          },
        });
      }
    );

    // Mini Cart Sample Product Add
    $(".js-cart-mini-bind-click").on(
      "click",
      ".cart-mini-sample .cart-mini-item-add",
      function (e) {
        e.preventDefault();

        var productID = $(this).data("cart-item-product-id");
        var cartItem = $(
          `.cart-mini-item-sample .cart-mini-item-quantity[data-cart-item-product-id="${productID}"]`
        );

        if (cartItem.length) {
          var newQuantity = parseInt(cartItem.html()) + 1;
          $.ajax({
            type: "POST",
            url: "/cart/change.js",
            data: { quantity: newQuantity, id: productID },
            dataType: "json",
            complete: function (res) {
              var data = res.responseJSON;

              cartItem.html(newQuantity);
              var orderItem = getOrderItemObj(data.items, productID);
              cartItem
                .closest(".cart-mini-item-details-footer")
                .find(".cart-mini-item-final-price")
                .html("$" + orderItem.final_line_price / 100);
              $(".cart-mini-subtotal-value")
                .attr("data-cart-cents", data.total_price)
                .html("$" + Math.round(data.total_price / 100));
              updateMiniCartFreeShippingBanner();
              validateMiniCartSampleProduct();
            },
          });
        } else {
          $.ajax({
            type: "POST",
            url: "/cart/add.js",
            data: { quantity: 1, id: productID },
            dataType: "json",
            complete: function (res) {
              var data = res.responseJSON;
              $(".cart-mini-items").prepend(`
              <div class="cart-mini-item cart-mini-item-sample" data-cart-mini-item="${data.id}">
                <div class="cart-mini-item-row">
                  <div class="
                    cart-mini-item-column
                    cart-mini-item-column-image
                  ">
                    <figure class="cart-mini-item-image">
                      <img src="${data.image}" width="72" height="72" alt="">
                    </figure>
                  </div>
                  <div class="
                    cart-mini-item-column
                    cart-mini-item-column-details
                  ">
                    <div class="cart-mini-item-details">
                      <div class="cart-mini-item-details-basic">
                        <span class="cart-mini-item-title">
                          <a href="${data.url}"">
                            ${data.product_title}
                          </a>
                        </span>
                        <div class="cart-mini-item-description">
                          ${data.variant_title ? `<span class="cart-mini-item-variant">${data.variant_title
                  }</span>` : ''}
                          <span class="cart-mini-item-final-price cart-mini-item-price money">Free</span>
                          <s class="cart-mini-item-original-price cart-mini-item-price money">${Shopify.formatMoney(
                    data.price,
                    "${{amount_no_decimals}}"
                  )}</s>
                        </div>
                      </div>
                      <span class="cart-mini-item-properties"></span>
                    </div>
                    <div class="cart-mini-item-details-footer">
                      <div class="cart-mini-item-quantity__wrap">
                        <button class="cart-mini-item-quantity__button js-cart-mini-item-adjust-quantity" data-cart-item-operator="minus">
                          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.05999 7.06L2.00666 4L5.05999 0.94L4.11999 0L0.119995 4L4.11999 8L5.05999 7.06Z" fill="#A9A19B"></path>
                          </svg>
                        </button>
                        <div class="cart-mini-item-quantity" data-cart-item-product-id="${data.id
                }">1</div>
                        <button class="cart-mini-item-quantity__button js-cart-mini-item-adjust-quantity" data-cart-item-operator="plus">
                          <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.0600004 0.94L3.11333 4L0.0600004 7.06L1 8L5 4L1 0L0.0600004 0.94Z" fill="#A9A19B"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="cart-mini-item-remove" aria-label="remove" role="button" data-cart-mini-item-remove="${data.key
                }"></div>
                      <div class="cart-mini-item-remove-spinner">
                        <svg class="svg-icon icon-spinner " xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path fill="currentColor" fill-rule="evenodd" d="M1.0436 10.9683C1.47582 10.9683 1.8262 11.3255 1.8262 11.7661C1.8262 17.4946 6.38122 22.1385 12.0001 22.1385C17.619 22.1385 22.174 17.4946 22.174 11.7661C22.174 11.3255 22.5244 10.9683 22.9566 10.9683C23.3889 10.9683 23.7392 11.3255 23.7392 11.7661C23.7392 18.3759 18.4835 23.7342 12.0001 23.7342C5.51677 23.7342 0.260986 18.3759 0.260986 11.7661C0.260986 11.3255 0.611372 10.9683 1.0436 10.9683Z"></path>\
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `);

              $.ajax({
                type: "GET",
                url: "/cart.json",
                dataType: "json",
                complete: function (res) {
                  data = res.responseJSON;

                  $(".cart-mini-subtotal-value")
                    .attr("data-cart-cents", data.total_price)
                    .html(
                      Shopify.formatMoney(
                        data.total_price,
                        "${{amount_no_decimals}}"
                      )
                    );

                  updateMiniCartFreeShippingBanner();
                  validateMiniCartSampleProduct();
                },
              });
            },
          });
        }
      }
    );
  });

  // Accordion Button Toggle Content
  function accordionToggleContent($el, $elParent, $content, $toggleButton) {
    var $elItem = $el.closest($elParent);
    var $elContent = $elItem.find($content);
    var $elToggleButton = $elItem.find($toggleButton);
    $elContent.toggle();
    $elToggleButton.toggleClass("accordion-button--active");
    return $elItem;
  }

  $(".js-accordion-toggle-trigger").on("click", function () {
    accordionToggleContent(
      $(this),
      ".js-toggle-content-wrap",
      ".js-toggle-content",
      ".js-accordion-button"
    );
  });
  $(".js-accordion-toggle-trigger--sub").on("click", function () {
    accordionToggleContent(
      $(this),
      ".js-toggle-content-wrap--sub",
      ".js-toggle-content--sub",
      ".js-accordion-button--sub"
    );
  });

  //Product Review CTA link to reviews on same page
  $(".js-product-review-cta").click(function (e) {
    e.preventDefault();
    var productReviewCta = $(this).attr("href");
    var headerHeight = $(".header-minimal").height();
    $("html,body").animate({
      scrollTop: $(productReviewCta).offset().top - headerHeight,
    });
  });

  //Product Review and Recommendation cta
  $(window).on("load", function () {
    if (
      window.location.hash == "#foursixty-hideable-container" ||
      window.location.hash ==
      "#shopify-section-static-cocktail-recipes-alternate"
    ) {
      var headerHeight = $(".header-minimal").height();
      $("html,body").animate({
        scrollTop: $(window.location.hash).offset().top - headerHeight,
      });
    }
  });

  //FAQ Page Acccordion and append query param

  $(".js-faq-custom-button").on("click", function () {
    var $questionId = $(this).attr("id");
    var queryParams = new URLSearchParams(window.location.search);

    queryParams.set("question", $questionId);
    history.replaceState(null, null, "?" + queryParams.toString());

    accordionToggleContent(
      $(this),
      ".faq-custom__item",
      ".faq-custom__answer",
      ".accordion-button"
    );
  });

  //FAQ Static Section Acccordion without param
  $(".js-page-faq-custom-button").on("click", function () {
    accordionToggleContent(
      $(this),
      ".faq-custom__item",
      ".faq-custom__answer",
      ".accordion-button"
    );
  });

  // Jump to specific question
  $(window).on("load", function () {
    var queryParams = new URLSearchParams(window.location.search);
    var questionParam = queryParams.get("question");

    if ($("#" + questionParam).length) {
      var $faqItem = accordionToggleContent(
        $("#" + questionParam),
        ".faq-custom__item",
        ".faq-custom__answer",
        ".accordion-button"
      );
      var headerHeight = $(".header-minimal").height();
      $("html,body").animate(
        {
          scrollTop: $faqItem.offset().top - headerHeight,
        },
        100
      );
    }
  });


  function openBotanicalItem($titleWrap, $botanicalItemButton, $botanicalContentWrap) {
    $titleWrap.addClass("botanical-glossary__item-title-wrap--with-bg");
    $botanicalItemButton.addClass("accordion-button--active");
    $botanicalContentWrap.addClass(
      "botanical-glossary__item-details-wrap--active"
    );
  }
  function closeBotanicalItem($titleWrap, $botanicalItemButton, $botanicalContentWrap) {
    $titleWrap.removeClass("botanical-glossary__item-title-wrap--with-bg");
    $botanicalItemButton.removeClass("accordion-button--active");
    $botanicalContentWrap.animate({ scrollTop: 0 }, 100, function () {
      $botanicalContentWrap.removeClass(
        "botanical-glossary__item-details-wrap--active"
      );
    });
  }


  //Botanical Glossary
  $(".js-botanical-toggle").on("click", function () {
    var $el = $(this);
    var $titleWrap = $el.find('.botanical-glossary__item-title-wrap');
    var $botanicalContentWrap = $el.find(".botanical-glossary__item-details-wrap");
    var $botanicalItemButton = $el.find(".js-botanical-button");

    if ($botanicalContentWrap.hasClass("botanical-glossary__item-details-wrap--active")) {
      closeBotanicalItem($titleWrap, $botanicalItemButton, $botanicalContentWrap)
    } else {
      openBotanicalItem($titleWrap, $botanicalItemButton, $botanicalContentWrap);
    }
  });

  $('.js-botanical-ignore').on('click', function (e) {
    e.stopPropagation();
  });


  //Dynamic Toggle Collection
  $(".js-toggle-collection").on("click", function (e) {
    e.preventDefault();
    var collectionToggleButtonActive = $(this);
    var collectionToggleButtonInactive = $(this).closest(".collection-toggle__content").find(".active");
    var productListIdActive = $(this).attr("href");
    var productListHide = $(this).closest(".collection-toggle__content").find(".product-list-active").attr("id");
    collectionToggleButtonActive.addClass("active");
    collectionToggleButtonInactive.removeClass("active");
    $("#" + productListIdActive).removeClass("product-list-hidden");
    $("#" + productListIdActive).addClass("product-list-active");
    $("#" + productListHide).addClass("product-list-hidden");
    $("#" + productListHide).removeClass("product-list-active");
  })

  //subscription-product-upsell 

  function showProductUpsellModal() {
    $(".subscription-upsell-modal").css("display", "block");
  }
  function hideProductUpsellModal() {
    $(".subscription-upsell-modal").css("display", "none");
  }
  function hideSubscriptionUpsellAtc() {
    $(".js-product-subscription-upsell-atc").css("display", "none");
  }
  function showOriginalProductAtc(id) {
    $("button").data("product-variant-id", id).removeClass("product-submit--hidden");
  }

  function storeSubscriptionUpsellProductIds(data) {
    var subscriptionUpsellProductIds = JSON.parse(localStorage.getItem('subscriptionUpsellProductIds'));
    subscriptionUpsellProductIds.push(data);
    localStorage.setItem('subscriptionUpsellProductIds', JSON.stringify(subscriptionUpsellProductIds));
  }

  if (!localStorage.getItem('subscriptionUpsellProductIds')) {
    var subscriptionUpsellProductIds = [];
    subscriptionUpsellProductIds.push(JSON.parse(localStorage.getItem('subscriptionUpsellProductIds')));
    localStorage.setItem('subscriptionUpsellProductIds', JSON.stringify(subscriptionUpsellProductIds));
  }

  var subscriptionProductvariantId = $(".js-product-subscription-upsell-atc").attr("data-product-subscription-variant-id");
  var subscriptionUpsellProductIdList = JSON.parse(localStorage.getItem('subscriptionUpsellProductIds'));
  subscriptionUpsellProductIdList.forEach(function (subscriptionProductId) {
    if (subscriptionProductId == subscriptionProductvariantId) {
      hideSubscriptionUpsellAtc();
      showOriginalProductAtc(subscriptionProductvariantId);
    }
  });

  $(".js-product-subscription-upsell-atc").on("click", function (e) {
    e.preventDefault();
    var $customSubscriptionUpsellAtc = $(this);
    var productSubscriptionUpsellId = $customSubscriptionUpsellAtc.attr("data-product-subscription-variant-id");
    var variantSubscriptionUpsellValue = ""
    if ($('input[name="Size"]:checked').length > 0) {
      variantSubscriptionUpsellValue = $('input[name="Size"]:checked').val();
    } else {
      variantSubscriptionUpsellValue = productSubscriptionUpsellId;
    }
    var selectedSubscriptionVariant = $("div[data-subscription-modal-variant-name='" + variantSubscriptionUpsellValue + "']");

    var variantSubscriptionQuantity = parseInt($('#quantity').val());
    var variantSubscriptionOriginalPrice = parseInt(selectedSubscriptionVariant.find(".subscription-upsell-modal__price-original").attr("data-variant-subscription-price-original"));
    var variantSubscriptionSavePrice = parseInt(selectedSubscriptionVariant.find(".subscription-upsell-modal__price-update").attr("data-variant-subscription-price-save"));

    $customSubscriptionUpsellAtc.closest(".product-button-container").find(".addtocart-button-active").addClass("js-product-addtocart");
    showProductUpsellModal();
    storeSubscriptionUpsellProductIds(productSubscriptionUpsellId);

    $(".subscription-upsell-modal__variant").removeClass("subscription-upsell-variant--active");
    setTimeout(function () {
      selectedSubscriptionVariant.addClass("subscription-upsell-variant--active"), 1000;
    });

    if ($('#quantity').length > 0) {
      $(".subscription-upsell-modal__price-original").text("$" + variantSubscriptionOriginalPrice * variantSubscriptionQuantity);
      $(".subscription-upsell-modal__price-update").text("$" + variantSubscriptionSavePrice * variantSubscriptionQuantity);
    } else {
      $(".subscription-upsell-modal__price-original").text();
      $(".subscription-upsell-modal__price-update").text();
    }

  });

  $(".js-dropdown-btn").on("click", function () {
    $(this).closest(".subscription-upsell-modal__dropdown").find(".subscription-upsell-modal__dropdown-content").toggle();
  });
  $(".js-subscription-dropdown-item").on("click", function () {
    var $selectedSubscriptionItem = $(this);
    var $selectedSubscriptionItemContainer = $(this).closest(".subscription-upsell-modal__dropdown");
    var $selectedSubscriptionItemText = $selectedSubscriptionItem.text();
    var $selectedSubscriptionItemPlanId = $selectedSubscriptionItem.attr("data-selling-plan-id");
    var $selectedSubscriptionItemVariantId = $selectedSubscriptionItem.attr("data-variant-id");
    $selectedSubscriptionItemContainer.find(".js-dropdown-item-selected").text($selectedSubscriptionItemText);
    $(".js-dropdown-item-selected").attr("data-selling-plan-id", $selectedSubscriptionItemPlanId);
    $(".js-dropdown-item-selected").attr("data-variant-id", $selectedSubscriptionItemVariantId);
    $selectedSubscriptionItemContainer.find(".subscription-upsell-modal__dropdown-content").toggle();
  });

  function addSubscriptionUpsellItem(quantity, selectedVariantItemId) {
    var $itemPlanId = $(".js-dropdown-item-selected").attr("data-selling-plan-id");
    var $itemVariantId = selectedVariantItemId;
    var $itemQuantity = quantity;
    console.log($itemPlanId, $itemVariantId, $itemQuantity);

    data = {
      "id": $itemVariantId,
      "quantity": $itemQuantity,
      "selling_plan": $itemPlanId
    }
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
      dataType: 'json',
      success: function () {
        var url = window.location.href;
        if (url.indexOf('?') == -1) {
          url += '?openMiniCart=1'
        }
        window.location.href = url;
      }
    });
  }

  $(".js-subscription-upsell-add-to-cart").on("click", function () {
    var quantity = ""
    var selectedVariantItemId = $('.subscription-upsell-variant--active').find(".js-dropdown-item-selected").attr("data-variant-id");
    if ($('#quantity').length > 0) {
      quantity = $('#quantity').val();
    } else {
      quantity = 1;
    }

    addSubscriptionUpsellItem(quantity, selectedVariantItemId);
  });

  $(".js-subscription-upsell-modal-close").on("click", function () {
    var $productAddToCart = $(".js-product-addtocart");
    $productAddToCart.click();
    hideProductUpsellModal();
  });

})(jQuery);

$(window).on("scroll resize", function () {
  var footerToTop = $(".static-footer").position().top;
  var scrollTop = $(document).scrollTop() + $(window).height();
  if (scrollTop > footerToTop) {
    $(".chat-icon").addClass("chat-icon--absolute");
  } else {
    $(".chat-icon").removeClass("chat-icon--absolute");
  }
});

function currencyFormSubmit(event) {
  event.target.form.submit();
}

document
  .querySelectorAll(".shopify-currency-form select")
  .forEach(function (element) {
    element.addEventListener("change", currencyFormSubmit);
  });
