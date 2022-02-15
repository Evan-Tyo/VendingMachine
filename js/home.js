$(document).ready(function () {
    loadButtons();
});

function loadButtons() {

    var gridButtonContainer = $('#gridButtonContainer');

    $.ajax({
        type: 'GET',
        url: 'https://cors-everywhere.herokuapp.com/http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                clearButtons(id);

                gridButtonContainer.append(loadButtonRow(id, name, price, quantity));
            })

        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function loadButtonRow(id, name, price, quantity) {

    var row =   '<div class="grid-item" role="button" onclick="selectItem(' + id + ')" id="button' + id + '">'
    row +=          '<div class="col-12">';
    row +=              '<div class="flex-container">';
    row +=                  '<div class="row buttonIdCustomClass">';
    row +=                      id;
    row +=                  '</div>';
    row +=                  '<br>';
    row +=                  '<div class="row buttonNameCustomClass">';
    row +=                      name;
    row +=                  '</div>';
    row +=                  '<div class="row buttonPriceCustomClass">';
    row +=                      '$ ';
    row +=                      price;
    row +=                  '</div>';
    row +=                  '<input type="hidden" id="buttonPrice' + id + '" value="' + price + '" required>';
    row +=                  '<div class="row buttonQuantityCustomClass">';
    row +=                      '<br>';
    row +=                      '<br>';
    row +=                      'Quanity Left: ';
    row +=                      quantity;
    row +=                  '</div>';
    row +=              '</div>';
    row +=          '</div>';
    row +=       '</div>';

    return row;
}

function clearButtons(id) {
    $('#button' + id).remove();
}

function makePurchase() {
    $('#errorMessages').empty();
    var total = $('#displayTotalMoneyIn').val() * 1;
    var id = $('#displayItemId').val();

    $.ajax({
        type: 'POST',
        url: 'https://cors-everywhere.herokuapp.com/http://vending.us-east-1.elasticbeanstalk.com/money/' + total + '/item/' + id,
        success: function (response) {
            $('#displayMessages').val('Thank You!!!');
            displayChangeAfterPurchase(response);
            loadButtons();
            newTotal(id);
        },
        error: function (response) {
            $('#displayMessages').val(response.responseJSON.message);
        }
    })
}

function newTotal(id) {
    var total = $('#displayTotalMoneyIn').val() * 1;
    var price = $('#buttonPrice' + id).val() * 1;
    total -= price;
    $('#displayTotalMoneyIn').val(total.toFixed(2));
}

function addDollar() {
    var total = $('#displayTotalMoneyIn').val() * 1;
    total += 1.00;
    $('#displayTotalMoneyIn').val(total.toFixed(2));
    displayTotalChange(total);
}

function addQuarter() {
    var total = $('#displayTotalMoneyIn').val()*1;
    total += 0.25;
    $('#displayTotalMoneyIn').val(total.toFixed(2));
    displayTotalChange(total);
}

function addDime() {
    var total = $('#displayTotalMoneyIn').val()*1;
    total += 0.10;
    $('#displayTotalMoneyIn').val(total.toFixed(2));
    displayTotalChange(total);
}

function addNickel() {
    var total = $('#displayTotalMoneyIn').val()*1;
    total += 0.05;
    $('#displayTotalMoneyIn').val(total.toFixed(2));
    displayTotalChange(total);
}

function selectItem(id) {
    $('#errorMessages').empty();
    $('#displayItemId').val(id);
}

function displayTotalChange(total) {
    var remainder = 0.00;

    var quarters = Math.floor(total / 0.25);
    var remainder = total - (quarters * 0.25);
    var remainder = (Math.ceil(remainder * 100) / 100).toFixed(2)

    var dimes = Math.floor(remainder / 0.10);
    var remainder = remainder - (dimes * 0.10);
    var remainder = (Math.ceil(remainder * 100) / 100).toFixed(2)

    var nickels = Math.floor(remainder / 0.05);
    var remainder = remainder - (nickels * 0.05);
    var remainder = (Math.ceil(remainder * 100) / 100).toFixed(2)

    var pennies = 0;

    displayChangeOutput(quarters, dimes, nickels, pennies);
}

function displayChangeAfterPurchase(response) {
    var quarters = response.quarters;
    var dimes = response.dimes;
    var nickels = response.nickels;
    var pennies = response.pennies;

    displayChangeOutput(quarters, dimes, nickels, pennies);
}

function displayChangeOutput(quarters, dimes, nickels, pennies) {
    var changeToReturn = '';

    if (quarters == 1) {
        changeToReturn += quarters + ' Quarter'
    }

    else if (quarters > 1) {
        changeToReturn += quarters + ' Quarters'
    }

    if (dimes == 1) {
        changeToReturn += ' ';
        changeToReturn += dimes + ' Dime'
    }

    else if (dimes > 1) {
        changeToReturn += ' ';
        changeToReturn += dimes + ' Dimes'
    }

    if (nickels == 1) {
        changeToReturn += ' ';
        changeToReturn += nickels + ' Nickel'
    }

    else if (nickels > 1) {
        changeToReturn += ' ';
        changeToReturn += nickels + ' Nickels'
    }

    if (pennies == 1) {
        changeToReturn += ' ';
        changeToReturn += pennies + ' Penny'
    }

    else if (pennies > 1) {
        changeToReturn += ' ';
        changeToReturn += pennies + ' Pennies'
    }

    $('#displayChange').val(changeToReturn);
}

function changeReturn() {
    $('#displayTotalMoneyIn').val('0.00');
    $('#displayMessages').val('');
    $('#displayItemId').val('');
    $('#displayChange').val('');
}