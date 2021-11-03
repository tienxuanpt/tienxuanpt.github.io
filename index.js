class Binance {
    // Hàm khởi tạo
    constructor() {
        let me = this;

        // ID của vòng lặp
        me.intervalID = null;
        // Thời gian lặp lại biểu đồ
        me.interValTime = 15;

        // Khởi tạo sự kiện
        me.initEvents();
    }

    // Khởi tạo các sự kiện
    initEvents() {
        let me = this;

        // Khởi tạo sự kiện cho input
        me.initEventInput();

        // Sự kiện khi thêm dòng
        me.initEventAddRow();

        // Sự kiện khi submit
        me.initEventSubmit();

        // Khởi tạo sự kiện taskbar
        me.initEventClickTaskBar();
    }

    // Khởi tạo sự kiện cho input
    initEventInput() {
        // Khi nhập thì tự động viết hoa
        $("input[type='text']").on("blur", function () {
            let value = $(this).val();

            $(this).val(value.toLocaleUpperCase());
        });

        // Tự động bôi đen
        $("input").on("focus", function () {
            $(this).select();
        });

        // Xóa dòng
        $("input.deleteIcon").on("click", function () {
            if ($(".rows").length > 1) {
                $(this).closest(".rows").remove();
            }
        });
    }

    // Sự kiện khi thêm dòng
    initEventAddRow() {
        $(".addRow").on("click", function () {
            let row = $(".rows").eq(0).clone(true);

            // Reset giá trị input
            row.find("input[type='text'], input[type='number']").val("");

            $(".form-content").append(row);
        });
    }

    // Bắt đầu thống kê
    startStatistic(){
        let me = this;

        // Xóa interval hiện tại
        if(me.intervalID){
            clearInterval(me.intervalID);
        }

        // Chạy luôn lần đầu
        me.submitData();

        // Khởi tạo chuỗi vòng lặp
        me.intervalID = setInterval(function(){
            me.submitData();
        }, me.interValTime*1000);
    }

    // Sự kiện khi submit
    initEventSubmit() {
        let me = this;

        $(".submit").on("click", function () {
            let valid = me.validateForm();

            if (valid) {
                me.showStep(2);
                me.startStatistic();
            }
        });
    }

    // Submit dữ liệu
    submitData() {
        let me = this,
            data = me.getDataForm(),
            sumData = {};

        if (data && data.length > 0) {
            data.filter(function (item) {
                // Số tiền cũ
                item.amount_old = Number.parseFloat(item.price_old) * common.config.priceVN * Number.parseFloat(item.quantity);

                // Lấy giá hiện tại của coin
                item.price_current = me.getPriceCurrent(item);

                // Tính số tiền mới
                item.amount_current = item.price_current * common.config.priceVN * Number.parseFloat(item.quantity);

                // Tính số tiền chênh lệch
                item.amount_diff = item.amount_current - item.amount_old;

                // Tính trạng thái
                item.status = item.amount_diff > 0 ? "Lãi" : "Lỗ";

                // Tính toán cho dòng summary
                sumData.amount_old = sumData.amount_old || 0;
                sumData.amount_old += item.amount_old;

                sumData.amount_current = sumData.amount_current || 0;
                sumData.amount_current += item.amount_current;

                sumData.amount_diff = sumData.amount_diff || 0;
                sumData.amount_diff += item.amount_diff;
            });

            sumData.code = "Tổng cộng:";
            sumData.status = sumData.amount_diff > 0 ? "Lãi" : "Lỗ";
            data.push(sumData);

            // Hiển thị dữ liệu ra table
            me.renderTableView(data);
        }
    }

    // Render hiển thị dữ liệu
    renderTableView(data) {
        let me = this;

        if (data && data.length > 0) {
            // Xóa các row cũ đi
            $("#customers .row-new").remove();

            // Duyệt từng bản ghi để build kết quả
            data.filter(function (item) {
                let statusCls = item.status == "Lỗ" ? "txtRed" : "txtBlue",
                    row = $(`<tr class='row-new'>
                                <td>${item.code}</td>
                                <td class='text-right'>${item.quantity || ""}</td>
                                <td class='text-right'>${item.price_old || ""}</td>
                                <td class='text-right'>${item.price_current || ""}</td>
                                <td class='text-right'>${common.formatMoney(item.amount_old)}</td>
                                <td class='text-right'>${common.formatMoney(item.amount_current)}</td>
                                <td class='text-right'>${common.formatMoney(item.amount_diff)}</td>
                                <td class='${statusCls}'>${item.status}</td>
                             </tr>`);

                $("#customers").append(row);
            });
        }
    }

    // Lấy giá của một coin
    getPriceCurrent(item) {
        let me = this,
            price = 0,
            url = common.config.urlBinance.replace("{0}", item.code);

        // Lấy giá hiện tại của coin
        common.Ajax(url, "GET", function (response) {
            price = Number.parseFloat(response.price);
        }, false);

        return price;
    }

    // Lấy dữ liệu trong form
    getDataForm() {
        let me = this,
            data = [];

        $(".form-content .rows").each(function () {
            let obj = {
                code: $(this).find("[field='code']").val(),
                price_old: $(this).find("[field='price_old']").val(),
                quantity: $(this).find("[field='quantity']").val()
            };

            data.push(obj);
        });

        return data;
    }

    // Validate form
    validateForm() {
        let valid = true;

        // Duyệt từng phàn tử để validate
        $("input[type='text']").each(function () {
            let value = $(this).val();

            if (!value) {
                valid = false;
            }
        });

        if (!valid) {
            alert("Vui lòng nhập đủ thông tin");
        }

        return valid;
    }

    // Khởi tạo sự kiện task bar
    initEventClickTaskBar() {
        let me = this;

        // Khi click vào thiết lập
        $(".setting-data").on("click", function () {
            me.showStep(1);
        });

        // Khi click vào thống kê
        $(".statistic-data").on("click", function () {
            let valid = me.validateForm();

            if (valid) {
                me.showStep(2);
                me.startStatistic();
            }
        });

        // Nạp lại dữ liệu mới
        $(".refresh-data").on("click", function () {
            me.startStatistic();
        });
    }

    // Hiển thị step
    showStep(step) {
        if (step == 1) {
            $(".setting, .statistic-data").show();
            $(".table-result, .refresh-data, .setting-data").hide();
        } else {
            $(".setting, .statistic-data").hide();
            $(".table-result, .refresh-data, .setting-data").show();
        }
    }
}

// Khởi tạo đối tượng cho binance
var binance = new Binance();