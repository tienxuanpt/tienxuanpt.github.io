// Cấu hình chung
var common = {};

// Cấu hình js
common.config = {
    urlBinance: "https://api.binance.com/api/v3/ticker/price?symbol={0}USDT",
    //urlBinance: "https://min-api.cryptocompare.com/data/price?fsym={0}&tsyms=USD&api_key=24e6b21185b3f3a399453aa2bb0203b326956732e9631c00a0a7400f4907ef10",
    //urlBinance: "https://min-api.cryptocompare.com/data/price?fsym={0}&tsyms=USD",
    priceVN: 23500
};

// Hàm ajax gọi lên server lấy dữ liệu
common.Ajax = (url, method, fnCallBack, async = true) => {
    $.ajax({
        url: url,
        method: method,
        async: async,
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            fnCallBack(response);
        },
        error: function (errormessage) {
            console.log(errormessage.responseText);
        }
    })
}