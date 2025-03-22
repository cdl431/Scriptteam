/frontend (folder)
├── index.html              ← Homepage / featured items / intro
├── login.html              ← Login & registration form
├── shopping.html           ← Product browsing + search/filter
├── product.html            ← Individual product details
├── cart.html               ← View/edit shopping cart, checkout
├── checkout.html           ← Payment input (UI only for now)
├── account.html            ← User dashboard (order history, info)
├── add-product.html        ← Form for sellers to list new items
├── edit-product.html       ← Form to edit product listing
├── admin.html              ← Admin dashboard (approve, flag, etc.)
│
├── css/ (folder)
│   ├── styles.css          ← Main stylesheet
│
├── js/ (folder)
│   ├── main.js             ← Shared scripts (nav, general UI)
│   ├── auth.js             ← Login, registration validation
│   ├── cart.js             ← Add/remove from cart, totals
│   ├── search.js           ← Search bar, filters
│   ├── product.js          ← Load and display product info
│   ├── account.js          ← User info, order history scripts
│   └── admin.js            ← Approve users, moderate listings
│
├── images/ (folder)        ← Logos, icons, demo product pics
│   └── ...