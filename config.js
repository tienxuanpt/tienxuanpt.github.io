// Cấu hình chung
var common = {};

// Cấu hình js
common.config = {
    //urlBinance: "https://api.binance.com/api/v3/ticker/price?symbol={0}USDT",
    urlBinance: "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR&api_key=24e6b21185b3f3a399453aa2bb0203b326956732e9631c00a0a7400f4907ef10",
    priceVN: 23500
};

// Hàm ajax gọi lên server lấy dữ liệu
common.Ajax = (url, method, fnCallBack, async = true) => {
    $.ajax({
        url: url,
        method: method,
        async: async,
        headers: {
            "Content-Type": "application/json",
            "authorization": "Apikey 24e6b21185b3f3a399453aa2bb0203b326956732e9631c00a0a7400f4907ef10"
        },
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            fnCallBack(response);
        },
        error: function (errormessage) {
            console.log(errormessage.responseText);
        }
    })
}