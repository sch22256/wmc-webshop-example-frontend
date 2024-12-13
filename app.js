document.querySelector("#btnLoadProducts").addEventListener("click", loadProducts);
document.getElementById("btnSearchName").addEventListener("click", searchProductsByName);
document.getElementById("btnFilterPrice").addEventListener("click", filterProductsByPrice);
document.getElementById('createProductForm').addEventListener('submit', createProduct);

async function loadProducts() {
    const url = `http://localhost:3000/api/products`;

    try {
        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products, "productsList");
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to search products by name
async function searchProductsByName() {
    const searchName = document.getElementById("searchName").value;
    const url = `http://localhost:3000/api/products?name=${searchName}`;

    try {
        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products, "searchResults");
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to filter products by price range
async function filterProductsByPrice() {
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    let url = `http://localhost:3000/api/products?`;

    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    try {
        const response = await fetch(url);
        const products = await response.json();
        displayProducts(products, "filterResults");
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to create a new product
async function createProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Product created successfully!');
            event.target.reset();
        } else {
            alert('Failed to create product.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the product.');
    }
}

// Function to delete a product by ID
async function deleteProduct(productId) {
    const url = `http://localhost:3000/api/products/${productId}`;

    try {
        const response = await fetch(url, { method: 'DELETE' });
        if (response.ok) {
            alert("Product deleted successfully!");
            loadProducts();
        } else {
            alert("Failed to delete product.");
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
    }
}

// Function to display products in the specified output area
function displayProducts(products, outputElementId) {
    const outputElement = document.getElementById(outputElementId);
    outputElement.innerHTML = "";

    if (products.length === 0) {
        const noProductsItem = document.createElement("li");
        noProductsItem.classList.add("list-group-item");
        noProductsItem.textContent = "No Products found.";
        outputElement.appendChild(noProductsItem);
        return;
    }

    products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.classList.add("list-group-item");
        productItem.innerHTML = `${product.id} - ${product.name} - ${product.price}€ - ${product.description}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "ms-2");
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
        
        productItem.appendChild(deleteButton);
        outputElement.appendChild(productItem);
    });
}
