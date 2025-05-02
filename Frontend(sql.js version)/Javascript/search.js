function searchProducts() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const products = document.getElementsByClassName('product');
  
    for (let i = 0; i < products.length; i++) {
      const name = products[i].dataset.name.toLowerCase();
      const tags = products[i].dataset.tags.toLowerCase();
  
      if (name.includes(input) || tags.includes(input)) {
        products[i].style.display = '';
      } else {
        products[i].style.display = 'none';
      }
    }
  }
  