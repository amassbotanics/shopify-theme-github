// Put your application javascript here
var shipScoutThresholdCents = 50 * 100;

// Update content of recharge widget
function setupModifyRecharge() {
  var rechargeWidgetLoaded = false;
  var rechargeWidgetCheckTimer = setInterval(function () {
    if (rechargeWidgetLoaded) {
      clearInterval(rechargeWidgetCheckTimer);
      return;
    }
    if ($(".rc_container").get(0)) {
      rechargeWidgetLoaded = true;
      var rechargeDataLabelDiscountText = $("span[data-label-discount]").text();

      // Swap position of price and option label
      $(".rc_widget__price").each(function () {
        $(this).prependTo($(this).parent());
      });

      // Update One-time purchase text
      $("span[data-label-text-onetime]").each(function () {
        $(this).text($(this).text().replace(":", "."));
      });

      // Update Subscribe text
      $("span[data-label-text-subsave]").each(function () {
        $(this).text($(this).text().replace(":", ""));
        $(this).after("&nbsp;");
      });

      $("span[data-label-discount]").each(function () {
        $(this).text($(this).text() + ".");
      });

      $("div[data-selector-subsave]").append(
        '<span class="rc_popup__hover">Details</span>'
      );

      // Modify Select Box
      $(".rc_widget__option__plans").append(
        '<div class="custom-select"></div>'
      );

      $(".rc_widget__option__plans select option").each(function () {
        $(this).html(
          $(this)
            .html()
            .replace("Delivery every", "Every")
            .replace("1 Month", "Month")
        );
      });

      $(".rc_widget__option__plans .custom-select").append(
        $(".rc_widget__option__plans select")
      );

      $("select.rc_widget__option__plans__dropdown").after(
        '<div class="arrow-drop"><svg class="svg-icon icon-down-arrow " xmlns="http://www.w3.org/2000/svg" width="924" height="545" viewBox="0 0 924 545"><path fill="currentColor" d="M0 82L82 0l381 383L844 2l80 82-461 461-80-82L0 82z"></path></svg></div>'
      );

      /* Popup */
      $(".rc_popup").html(
        '<div class="rc_popup__block"><div class="rc_popup__block__content"><div class="rc_popup__close" style="display: none;">x</div><p class="rc_popup__block__header">How subscriptions work</p><p class="rc_popup__block__content">We invite you to join an AMASS subscription, where you will receive a replenishing delivery of AMASS every 1, 2 or 3 months, based on your choice. By selecting this option, you will save ' +
          rechargeDataLabelDiscountText +
          ' on every AMASS delivery.<ul class="rc_popup__block__features"><li>Save ' +
          rechargeDataLabelDiscountText +
          " on every order.</li><li>Change your upcoming delivery dates to suit your needs.</li><li>Cancel at anytime by emailing orders@amass.com.</li></ul></p></div></div>"
      );

      $(".rc_popup__hover").click(function () {
        $(".rc_popup").addClass("visible");
      });

      $(".rc_popup__close").click(function () {
        $(".rc_popup").removeClass("visible");
      });

      /* Hard Seltzer Subscription */
      setupSeltzerSubscription();
    }
  }, 500);
}

function setupRouteWidgetObserver() {
  var routeWidgetLoaded = false;
  var routeWidgetCheckTimer = setInterval(() => {
    if (routeWidgetLoaded) {
      clearInterval(routeWidgetCheckTimer);
      return;
    }
    if ($(".rw-checkbox-span").get(0)) {
      routeWidgetLoaded = true;

      // Turn on route if it's off
      if ($(".rw-checkbox-span").hasClass("rw-unchecked")) {
        $(".rw-checkbox-span").click();
      }
    }
  }, 500);
}

function setupFoursixtyObserver() {
  setInterval(() => {
    if ($(".fs-shopify-add-cart")) {
      if (
        [
          "impeachment",
          "botanic-vodka",
          "dry-gin-los-angeles",
          "surfer-rosso-hard-seltzer",
          "faerie-fizz-hard-seltzer",
          "sun-sign-hard-seltzer",
        ].indexOf($(".fs-shopify-add-cart").attr("data-product-id")) !== -1
      ) {
        $(".fs-shopify-add-cart").hide();
      }
    }
  }, 100);
}

function onItemRemove(event) {
  $(event.target).hide();
  $(event.target).next().show();

  // mixpanel.track("Removed from Cart", {
  //   name: $(event.target)
  //     .parents(".cart-mini-item")
  //     .find(".cart-mini-item-title a")
  //     .text(),
  // });
}

function updateMiniCartFreeShippingBanner() {
  var cartCents = parseInt(
    $(".cart-mini-subtotal-value")
      ? $(".cart-mini-subtotal-value").attr("data-cart-cents")
      : ""
  );
  var remainingCents = shipScoutThresholdCents - cartCents;
  var remainingAmount = Shopify.formatMoney(
    remainingCents,
    "${{amount_no_decimals}}"
  );

  if (remainingCents > 0) {
    $(".cart-mini-shipping-countdown").text(
      `You are ${remainingAmount} away from free shipping!`
    );
  } else {
    $(".cart-mini-shipping-countdown").text(
      "You are now qualified for free shipping!"
    );
  }
}

function setupMiniCartObserver() {
  var miniCartLoaded = false;
  var miniCartCheckTimer = setInterval(() => {
    if ($(".cart-mini").get(0) && !miniCartLoaded) {
      miniCartLoaded = true;
      clearInterval(miniCartCheckTimer);

      hideGiftNote();
      setupMiniCartRecharge();
      validateMiniCartSampleProduct();
      updateMiniCartFreeShippingBanner();

      var miniCartObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          $('form.mini-cart button[type="submit"]').on("click", function (e) {
            $(this).find("span").hide();
            $(this).find(".cart-mini-actions__checkout-button-spinner").show();
          });

          $(".cart-mini-item-remove").off("click", onItemRemove);
          $(".cart-mini-item-remove").on("click", onItemRemove);

          updateMiniCartFreeShippingBanner();
          validateMiniCartSampleProduct();
          setupMiniCartRecharge();
        });
      });

      var observerConfig = {
        attributes: true,
      };
      miniCartObserver.observe($(".cart-mini").get(0), observerConfig);
    }
  }, 500);
}

function hideUSProducts() {
  if (localStorage.getItem("user-location") === "uk") {
    $("li.product").not(".uk").remove();

    $("ul.main-header--nav-links li.has-mega-nav").not(".uk").remove();
    $("ul.main-header--nav-links li.has-mega-nav.uk ul.mega-nav-list li.list")
      .not(".uk")
      .remove();
    $(
      "ul.main-header--nav-links li.has-mega-nav.uk ul.mega-nav-list li.list ul.list-wrap li.list-item"
    )
      .not(".uk")
      .remove();
  }
}

function hideGiftNote() {
  if (localStorage.getItem("user-location") === "uk") {
    $(".cart-mini-note").remove();
    $(".cart-tools .instructions").remove();
  }
}

function hideAnnouncements() {
  if (localStorage.getItem("user-location") === "uk") {
    $(".pxs-announcement-bar").hide();
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// /**
//  * Setup Optimizely AB Test for [Price Hidden AB]
//  *
//  * @param {optimizelyClientInstance} optimizely Optimizely Instance
//  * @param {string} userId Unique Cookie User ID
//  */

// function shopAllProductSortingTest(optimizely, userId) {
//   var flagKey = "shop_all_product_sorting";
//   var experimentKey = "shop_all_product_sorting_experiment";
//   var user = optimizely.createUserContext(userId);
//   var decision = user.decide(flagKey);
//   var isEnabled = decision.enabled;
//   if (isEnabled) {
//     var variation = optimizely.getVariation(experimentKey, userId);
//     var currentUrl = $(location).attr('href');
//     // Variation
//     if (variation === "sort_by_highest_price") {
//         if( currentUrl == "https://amass.com/collections/shop-all" ) {
//           $(".collection-content").removeClass("shop-all-hide-content");
//         }
//     }
//     if (variation === "sort_by_best_seller") {
//         if( currentUrl == "https://amass.com/collections/shop-all" ) {
//           window.location.href = "https://amass.com/collections/shop-all-best-sellers";
//         }
//         if (currentUrl.indexOf('shop-all-best-sellers') != -1) {
//           $(".collection-content").removeClass("shop-all-hide-content");
//         }
//     }
//   } else {
//     console.warn("Optimizely: [" + flagKey + "] flag is off");
//     $(".collection-content").removeClass("shop-all-hide-content");
//   }
// }
// function seltzerPdpBannerTest(optimizely, userId) {
//   var flagKey = "rtd_banner";
//   var experimentKey = "rtd_banner_experiment";
//   var user = optimizely.createUserContext(userId);
//   var decision = user.decide(flagKey);
//   var isEnabled = decision.enabled;
//   if (isEnabled) {
//     var variation = optimizely.getVariation(experimentKey, userId);
//     // Variation
//     if (variation === "show_rtd_banner") {
//       $(".figure-block__section-hidden").addClass(
//         "figure-block__section--show"
//       );
//     }
//   } else {
//     console.warn("Optimizely: [" + flagKey + "] flag is off");
//   }
//   // Add Tracking
//   $(".js-opti-add-to-cart").on("click", function () {
//     user.trackEvent("seltzer-add-to-cart");
//   });
// }

// function applyOptimizelyABTest() {
//   // set UserId
//   var cookieKey = "optimizely_end_user_id";

//   if (!getCookie(cookieKey)) {
//     setCookie(cookieKey, uuidv4());
//   }

//   var userId = getCookie(cookieKey);

//   // Initilize Optimizely Instance
//   var optimizelyClientInstance = optimizelySdk.createInstance({
//     datafile: window.optimizelyDatafile,
//   });

//   var variation = optimizelyClientInstance.activate("banner_type", userId);
//   if (variation === "welcome") {
//     console.log("show welcome banner");
//   } else if (variation === "highlight") {
//     console.log("show highlights");
//   } else {
//     console.log("show normal banner");
//   }

//   optimizelyClientInstance.track("visit", userId);

//   // Tests
//   seltzerPdpBannerTest(optimizelyClientInstance, userId);
//   shopAllProductSortingTest(optimizelyClientInstance, userId);
// }

function showMaximumPriceForUnavailableProduct() {
  try {
    var { product } = JSON.parse(
      $('script[data-section-id="static-product"]').html()
    );

    if (!product.available) {
      var maxVariant = product.variants.find(
        (variant) => variant.price === product.price_max
      );

      if (maxVariant) {
        $(
          "input[data-product-option='option1'][value='" +
            maxVariant.option1 +
            "']"
        ).click();
      }
    }
  } catch (e) {}
}

function classifyNewVsReturningVisitor() {
  if (window.location.href !== "/") {
    return;
  }
  // Increase visit count
  var cookieKey = "amass_visit_count";
  var visitCount = parseInt(getCookie(cookieKey)) || 0;

  setCookie(cookieKey, visitCount + 1);

  if (visitCount > 10) {
    console.log("** returning visitor");
  } else {
    console.log("** new visitor");
  }
}

function showShipScoutThresholds() {
  window._shipScout = window._shipScout || [];
  _shipScout.push(function (response) {
    //apply any exchange rates to currency if necessary
    shipScoutThresholdCents =
      window.Shopify && Shopify.currency && Shopify.currency.rate
        ? response.freeShippingThresholdCents * Shopify.currency.rate
        : response.freeShippingThresholdCents;

    //format currency
    var currencyFormat = ShipScoutGetCurrency();

    //get threshold amount with currency symbol
    var thresholdAmount = ShipScoutFormatMoney(
      shipScoutThresholdCents,
      currencyFormat
    );

    if (thresholdAmount > 0) {
      $(".pxs-announcement-banner").each(function () {
        $(this).html($(this).html().replace("$50", thresholdAmount));
      });
    }
  });
}

function setupMiniCartRecharge() {
  let reChargeWidgetLoaded = false;

  const reChargeWidgetInterval = setInterval(() => {
    if (window.ReChargeWidget && !reChargeWidgetLoaded) {
      reChargeWidgetLoaded = true;
      clearInterval(reChargeWidgetInterval);

      $(".cart-mini-items .cart-mini-item").each(function () {
        const cartItem = $(this);
        const productId = parseInt($(this).attr("data-product-id"), 10);
        const variantId = parseInt($(this).attr("data-cart-mini-item"), 10);
        const rechargeSelect = $(this).find(".cart-mini-item__recharge-select");
        const sellingPlanId = parseInt(
          $(this).find(".cart-mini-item-properties").attr("selling-plan-id"),
          10
        );
        const variantName = $(this).find(".cart-mini-item-variant").text();

        if (rechargeSelect.find("option").length) {
          return;
        }

        try {
          if (in_hard_seltzer_collection && variantName === "12 pack") {
            return;
          }
        } catch { }

        window.ReChargeWidget.api.fetchProduct(productId).then((options) => {
          if (
            options.in_recharge &&
            options.selling_plan_groups.length &&
            options.selling_plan_groups[0].selling_plans.length
          ) {
            const sellingPlanGroup = options.selling_plan_groups[0];
            rechargeSelect.append(
              `<option value=""${
                sellingPlanId ? "" : " selected"
              }>Subscribe & Save ${
                sellingPlanGroup.selling_plans[0].price_adjustments_value
              }%</option>`
            );
            for (const sellingPlan of sellingPlanGroup.selling_plans) {
              rechargeSelect.append(`
                <option value="${sellingPlan.selling_plan_id}"${
                sellingPlanId === sellingPlan.selling_plan_id ? " selected" : ""
              }>${sellingPlan.selling_plan_name.replace(
                "Delivery ",
                ""
              )}</option>
              `);
            }

            rechargeSelect.on("change", function () {
              const sellingPlanId = this.value;
              const quantity = parseInt(
                cartItem.find(".cart-mini-item-quantity").html(),
                10
              );

              $.post({
                type: "POST",
                url: "/cart/change.js",
                data: {
                  id: variantId,
                  quantity: 0,
                },
                dataType: "json",
                complete: function (res) {
                  $.post({
                    type: "POST",
                    url: "/cart/add.js",
                    data: {
                      id: variantId,
                      quantity,
                      selling_plan: sellingPlanId,
                    },
                    dataType: "json",
                    complete: function (res) {
                      var data = res.responseJSON;

                      cartItem
                        .find(".cart-mini-item-final-price")
                        .html(
                          Shopify.formatMoney(
                            data.final_line_price,
                            "${{amount_no_decimals}}"
                          )
                        );

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
                },
              });
            });

            rechargeSelect.show();
          }
        });
      });
    }
  }, 500);
}

function validateMiniCartSampleProduct() {
  try {
    const sampleProductId = $(".cart-mini-sample .cart-mini-item").attr(
      "data-cart-mini-item"
    );
    const sampleProductLimit = parseInt(
      $(".cart-mini-sample").attr("data-limit"),
      10
    );
    let sampleProductCount = 0;
    if (
      $(
        `.cart-mini-items .cart-mini-item .cart-mini-item-quantity[data-cart-item-product-id="${sampleProductId}"]`
      )
    ) {
      sampleProductCount = parseInt(
        $(
          `.cart-mini-items .cart-mini-item .cart-mini-item-quantity[data-cart-item-product-id="${sampleProductId}"]`
        ).html(),
        10
      );
    }
    const cartSubTotal = $(".cart-mini-subtotal-value.money").attr(
      "data-cart-cents"
    );

    const sampleProductThreshold = parseInt(
      $(".cart-mini-sample").attr("data-threshold"),
      10
    );

    if (
      sampleProductLimit <= sampleProductCount ||
      cartSubTotal < sampleProductThreshold * 100
    ) {
      $(".cart-mini-sample").hide();
    } else {
      $(".cart-mini-sample").show();
    }

    $(
      `.cart-mini-item[data-cart-mini-item="${sampleProductId}"] .cart-mini-item-quantity__button`
    ).attr("disabled", "disabled");
  } catch (err) {
    console.log(err);
  }
}

function setupSeltzerSubscription() {
  // variant-option select on product page
  try {
    if (in_hard_seltzer_collection) {
      $(".rc_container_wrapper").hide();
  
      $(".option-value-input").on("change", function () {
        if (this.value === "12 pack") {
          $(".rc_container_wrapper label[data-label-onetime]").click();
          $(".rc_container_wrapper").hide();
        } else {
          $(".rc_container_wrapper").show();
        }
      });
    }
  } catch { }
}

$(function () {
  setupModifyRecharge();
  setupRouteWidgetObserver();
  setupFoursixtyObserver();
  setupMiniCartObserver();
  hideUSProducts();
  hideGiftNote();
  hideAnnouncements();
  // applyOptimizelyABTest();
  showMaximumPriceForUnavailableProduct();
  classifyNewVsReturningVisitor();
  showShipScoutThresholds();
});
