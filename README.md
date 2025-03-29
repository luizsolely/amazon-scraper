# Amazon Scraper

This is a project that scrapes Amazon product information (title, image, rating, and price) for the Brazilian (BR) and US regions.

## Endpoints

The application exposes the following API endpoints:

1. **`/scrape-br`**
   - **Method**: GET
   - **Description**: Scrapes Amazon Brazil (amazon.com.br) for products based on the provided keyword.
   - **Query parameter**: 
     - `keyword` (required) – The search term for the Amazon search.
   - **Example**: 
     ```
     http://localhost:3000/scrape-br?keyword=laptop
     ```

2. **`/scrape-us`**
   - **Method**: GET
   - **Description**: Scrapes Amazon USA (amazon.com) for products based on the provided keyword.
   - **Query parameter**: 
     - `keyword` (required) – The search term for the Amazon search.
   - **Example**: 
     ```
     http://localhost:3000/scrape-us?keyword=laptop
     ```


## Installation

To get started with this project, follow these steps:

1. Clone the repository;

2. Install dependencies:

- **Backend** (Navigate to the `back` folder):
  ```
  cd back
  bun install
  ```

- **Frontend** (Navigate to the `front` folder):
  ```
  cd front
  bun install
  ```

## Running the Project

1. To start the backend server:

- In the `back` folder, run:
  ```
  bun run server.js
  ```
- The backend server will be running on `http://localhost:3000`.

2. To run the frontend:

- In the `front` folder, run:
   ```
  bun run dev
  ```
- The backend server will be running on `http://localhost:5173`.

## Usage

- On the frontend, enter a keyword in the search box and click the respective button (`Search Brazil` or `Search US`) to scrape Amazon products.
- The results will be displayed on the same page with product details including title, image, price, and rating.

## Technologies Used

- **Backend**: Bun, Express, Axios, JSDOM, CORS
- **Frontend**: HTML, CSS, JavaScript
- **Scraping**: Amazon Brazil and USA product data
- **Scraping**: Amazon Brazil and USA product data
