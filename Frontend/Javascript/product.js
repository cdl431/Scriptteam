document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("productCategory");
    const customCategoryContainer = document.getElementById("customCategoryContainer");
  
    
    if (categorySelect && customCategoryContainer) {
        categorySelect.addEventListener("change", () => {
            if (categorySelect.value === "other") {
            customCategoryInput.style.display = "block";
            } else {
                customCategoryInput.style.display = "none";
            }
        });
    } 
});
// this is for an edit-product function i have brayden