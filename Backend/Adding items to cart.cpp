#include <iostream>
#include <vector>
#include <string>
#include <iomanip>

using namespace std;

struct Item {
    string name;
    double price;
    int quantity;
};

vector<Item> cart;

void addItem(const string& name, double price, int quantity) {
    cart.push_back({name, price, quantity});
    cout << "Added " << quantity << " x " << name << " to the cart.\n";
}

void viewCart() {
    if (cart.empty()) {
        cout << "Your cart is empty.\n";
        return;
    }

    double total = 0;
    cout << "\nItems in Cart:\n";
    cout << left << setw(15) << "Item" << setw(10) << "Price" << setw(10) << "Qty" << "Subtotal\n";
    cout << "---------------------------------------------\n";

    for (const auto& item : cart) {
        double subtotal = item.price * item.quantity;
        total += subtotal;
        cout << left << setw(15) << item.name
             << setw(10) << fixed << setprecision(2) << item.price
             << setw(10) << item.quantity
             << subtotal << endl;
    }

    cout << "\nTotal: $" << fixed << setprecision(2) << total << "\n";
}

int main() {
    int choice;
    string name;
    double price;
    int quantity;

    while (true) {
        cout << "\n1. Add Item\n2. View Cart\n3. Exit\nChoose an option: ";
        cin >> choice;

        if (choice == 1) {
            cout << "Enter item name: ";
            cin >> ws;
            getline(cin, name);
            cout << "Enter item price: $";
            cin >> price;
            cout << "Enter quantity: ";
            cin >> quantity;
            addItem(name, price, quantity);
        } else if (choice == 2) {
            viewCart();
        } else if (choice == 3) {
            cout << "Thank you for shopping!\n";
            break;
        } else {
            cout << "Invalid option.\n";
        }
    }

    return 0;
}