// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script handles player data

const player = {
    _balance: 100,
    _betAmount: 1,

    get balance() {
        return this._balance;
    },

    set balance(num) {
            this._balance = num;
    },

    addBalance(amount) {
        this._balance += amount;
    },

    placeBet() {
        this._balance -= this._betAmount;
    }
}