// Cấu hình chung
var common = {};

// Cấu hình js
common.config = {
    urlBinance: "https://api.binance.com/api/v3/ticker/price?symbol={0}USDT",
    priceVN: 23500
};

// Hàm format số tiền
common.formatMoney = money => {
    if(money && !isNaN(money)){
        return money.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
    }else{
        return money;
    }
}

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