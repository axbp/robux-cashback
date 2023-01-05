console.log("init")

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time*1000));
}

function getCSRF() {
  return fetch("https://www.roblox.com/home").then(function(data) {
    return data.text();
  }).then(function(data) {
    return data.split('meta name="csrf-token" data-token="')[1].split('" />')[0]
  });
}

// getCSRF().then(function(csrf) {
//   console.log(csrf);
// });

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url == `https://economy.roblox.com/v1/purchases/products/${productId}?cashback`) return

    var productId = Number(details.url.substring(details.url.lastIndexOf('/') + 1));
    if ((isNaN(productId) == true) || productId == null) return

    var parsedBody = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))));
    try {
      chrome.storage.sync.get("cashbackPlaceId", function(data) {
        getCSRF().then(function(csrf) {
          //console.log(`fetching https://economy.roblox.com/v1/purchases/products/${productId}?cashback with csrf ${csrf}`)
          return fetch(`https://economy.roblox.com/v1/purchases/products/${productId}?cashback`, {
            method: "POST",
            headers: {
              "X-CSRF-TOKEN": csrf,
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              expectedCurrency: parsedBody.expectedCurrency,
              expectedPrice: parsedBody.expectedPrice,
              expectedSellerId: parsedBody.expectedSellerId,
              userAssetId: parsedBody.userAssetId || 0,
              expectedPromoId: 0,
              saleLocationType: "Game",
              saleLocationId: data.cashbackPlaceId,
            }),
          }).then(function(response) {
            if (response.status == 200) {
              sleep(0.5)
              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
              });
            }
          }
          )
        })
      })
    } catch (error) {
      console.error(error);
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://economy.roblox.com/v1/purchases/products/*"] },
  ["requestBody"]
);
