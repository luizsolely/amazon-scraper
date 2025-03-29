document.getElementById("scrape-br").addEventListener("click", () => fetchData("scrape-br", "BR"));
document.getElementById("scrape-us").addEventListener("click", () => fetchData("scrape-us", "US"));

async function fetchData(route, region) {
    const keyword = document.getElementById("keyword").value.trim();
    if (!keyword) {
        alert("Please enter a search term!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/${route}?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        displayResults(data, region);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayResults(products, region) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (products.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    products.forEach(({ title, image, rating, price }) => {
        // Adjust the price symbol and decimal separator according to the region
        const formattedPrice = region === "BR" ? price.replace(".", ",") : price;
        const formattedRating = region === "BR" ? rating.replace(".", ",") : rating;

        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${image}" alt="${title}">
            <h3>${title}</h3>
            <p><strong>${region === "BR" ? "Preço" : "Price"}:</strong> ${formattedPrice}</p>
            <p><strong>${region === "BR" ? "Avaliação" : "Rating"}:</strong> ${formattedRating}</p>
        `;
        resultsDiv.appendChild(productElement);
    });
}
