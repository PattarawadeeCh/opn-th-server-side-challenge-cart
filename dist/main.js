"use strict";
class Cart {
    constructor() {
        this.items = new Map();
        this.discounts = new Map();
    }
    createCart() {
        this.items.clear();
        this.discounts.clear();
    }
    addProduct(productId, quantity) {
        this.items.set(productId, (this.items.get(productId) || 0) + quantity);
    }
    updateProduct(productId, quantity) {
        if (this.items.has(productId)) {
            this.items.set(productId, quantity);
        }
    }
    removeProduct(productId) {
        this.items.delete(productId);
    }
    destroyCart() {
        this.createCart();
    }
    isProductExists(productId) {
        return this.items.has(productId);
    }
    isCartEmpty() {
        return this.items.size === 0;
    }
    listItems() {
        return Array.from(this.items.entries());
    }
    countUniqueItems() {
        return this.items.size;
    }
    totalItems() {
        let total = 0;
        for (const quantity of this.items.values()) {
            total += quantity;
        }
        return total;
    }
    applyDiscount(discountName, discountType, amount, maxDiscount) {
        this.discounts.set(discountName, { type: discountType, amount, maxDiscount });
    }
    calculateDiscount(total) {
        let totalDiscount = 0;
        for (const discount of this.discounts.values()) {
            if (discount.type === 'fixed') {
                totalDiscount += discount.amount;
            }
            else if (discount.type === 'percentage') {
                let discountAmount = total * (discount.amount / 100);
                if (discount.maxDiscount !== undefined) {
                    discountAmount = Math.min(discountAmount, discount.maxDiscount);
                }
                totalDiscount += discountAmount;
            }
        }
        return totalDiscount;
    }
    removeDiscount(discountName) {
        this.discounts.delete(discountName);
    }
    applyFreebie(productId, freebieProductId, quantity = 1) {
        if (this.isProductExists(productId)) {
            this.addProduct(freebieProductId, quantity);
        }
    }
    calculateTotal() {
        const total = this.totalItems() * 100; // Assuming each item costs 100 THB
        const totalDiscount = this.calculateDiscount(total);
        return total - totalDiscount;
    }
    getFinalTotal() {
        return this.calculateTotal();
    }
}
// Example usage
const cart = new Cart();
cart.createCart();
// Adding products
cart.addProduct(1, 2); // Product ID 1, quantity 2
cart.addProduct(2, 1); // Product ID 2, quantity 1
// Update product
cart.updateProduct(1, 10); // Update Product ID 1 to quantity 10
// List items
console.log("Items in cart:", cart.listItems()); // Should show [[1, 10], [2, 1]]
// Apply discount
cart.applyDiscount("SUMMER10", "percentage", 10, 100);
// Get total
console.log("Total amount:", cart.getFinalTotal()); // Total after discount
// Apply freebie
cart.applyFreebie(1, 3); // If Product 1 is in cart, add Product 3 for free
// List items after applying freebie
console.log("Items in cart after applying freebie:", cart.listItems()); // Should show [[1, 10], [2, 1], [3, 1]]
// Remove discount
cart.removeDiscount("SUMMER10");
// Get final total after removing discount
console.log("Final total amount:", cart.getFinalTotal());
// Destroy cart
cart.destroyCart();
console.log("Is cart empty?", cart.isCartEmpty()); // Should return true
