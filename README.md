# Amazon Scraper Project

This project is a web scraper for Amazon. It scrapes product details from Amazon using a backend built with `Bun` and frontend in `HTML`, `CSS`, and `JavaScript`.

## Installation and Setup

### Backend (Bun)

1. Navigate to the `back` directory:

    ```bash
    cd BunProject/back
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

3. Start the backend server:

    ```bash
    bun server
    ```

The backend will run on `http://localhost:3000`.

### Frontend

1. Navigate to the `front` directory:

    ```bash
    cd BunProject/front
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

3. Start the frontend:

    ```bash
    bun run dev
    ```

The frontend will run on `http://localhost:5173`.

## How to Use

1. Open the frontend in your browser (`http://localhost:5173`).
2. Enter a search term in the search bar.
3. Click either the "Scrape US" or "Scrape BR" button.
4. Results will appear below, showing product details such as price and rating.
