// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script contains utility functions


// removes default browser styling for buttons
const resetButtonStyle = btn => {
    btn.parent('container');
    btn.style('border-style: none');
    btn.style('padding: 0');
    btn.style('background: none');
    btn.style('outline: none');
}

// format numbers to currency strings
const numToCurrency = num => {
    const formatter = new Intl.NumberFormat('en-EE', {
        style: 'currency',
        currency: 'EUR'
    });
    return formatter.format(num);
}

// returns object's key specified by a value
const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}