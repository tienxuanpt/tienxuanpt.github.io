class Binance {
    // Hàm khởi tạo
    constructor() {
        let me = this;

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
            row.find("input[type='text']").val("");

            $(".form-content").append(row);
        });
    }

    // Sự kiện khi submit
    initEventSubmit() {
        let me = this;

        $(".submit").on("click", function () {
            let valid = me.validateForm();

            if (valid) {
                me.showStep(2);
                me.submitData();
            }
        });
    }

    // Submit dữ liệu
    submitData() {
        let me = this,
            data = me.getDataForm();

        if (data && data.length > 0) {
            data.filter(function (item) {
                // Số tiền cũ
                item.amount_old = item.price_old * common.config.priceVN;

                // Lấy giá hiện tại của coin
                item.price_current = me.getPriceCurrent(item);

                // Tính số tiền mới
                item.amount_current = item.price_current * common.config.priceVN;

                // Tính số tiền chênh lệch
                item.amount_diff = item.amount_current - item.amount_old;

                // Tính trạng thái
                item.status = item.amount_diff > 0 ? "Lãi" : "Lỗ";
            });

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
                let row = $(`<tr class='row-new'>
                                <td>${item.code}</td>
                                <td>${item.price_old}</td>
                                <td>${item.price_current}</td>
                                <td>${item.amount_old}</td>
                                <td>${item.amount_current}</td>
                                <td>${item.amount_diff}</td>
                                <td>${item.status}</td>
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
            price = response.price;
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
                me.submitData();
            }
        });

        // Nạp lại dữ liệu mới
        $(".refresh-data").on("click", function () {
            me.submitData();
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