#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

struct User {
    string username = "johndoe";
    string name = "John Doe";
    string password = "1234";
    bool active = true;
};

User user;

void callJSNotification() {
    system("node account.js");
}

void viewAccount() {
    if (!user.active) {
        cout << "Account not found.\n";
        return;
    }

    cout << "\n--- My Account ---\n";
    cout << "Username: " << user.username << "\n";
    cout << "Full Name: " << user.name << "\n";

    callJSNotification(); // trigger JS
}

void updateName() {
    if (!user.active) return;

    string newName;
    cin.ignore();
    cout << "Enter new name: ";
    getline(cin, newName);
    user.name = newName;

    cout << "Name updated successfully.\n";
    callJSNotification();
}

void changePassword() {
    string current, newPass;
    cout << "Enter current password: ";
    cin >> current;

    if (current == user.password) {
        cout << "Enter new password: ";
        cin >> newPass;
        user.password = newPass;
        cout << "Password updated.\n";
        callJSNotification();
    } else {
        cout << "Incorrect password.\n";
    }
}

void deleteAccount() {
    string confirm;
    cout << "Delete account? (yes/no): ";
    cin >> confirm;

    if (confirm == "yes") {
        user.active = false;
        cout << "Account deleted.\n";
        callJSNotification();
    }
}

int main() {
    int choice;

    while (true) {
        cout << "\n=== Manage My Account ===\n";
        cout << "1. View Account\n";
        cout << "2. Update Name\n";
        cout << "3. Change Password\n";
        cout << "4. Delete Account\n";
        cout << "5. Exit\n";
        cout << "Select option: ";
        cin >> choice;

        switch (choice) {
            case 1: viewAccount(); break;
            case 2: updateName(); break;
            case 3: changePassword(); break;
            case 4: deleteAccount(); break;
            case 5: cout << "Goodbye!\n"; return 0;
            default: cout << "Invalid option.\n";
        }
    }

    return 0;
}
