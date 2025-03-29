import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"]
}));

async function scrapeAmazonBR(keyword) {
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                // Cabeçalho HTTP para parecer uma requisição real
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.amazon.com.br/",
                "Connection": "keep-alive",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
            }
        });

        // Criação do objeto DOM para manipulação da página
        const dom = new JSDOM(data);
        const document = dom.window.document;

        let products = [];

        // Loop sobre os resultados da busca
        document.querySelectorAll('[data-component-type="s-search-result"]').forEach(product => {
            const title = product.querySelector("h2 span")?.textContent?.trim();
            const image = product.querySelector("img")?.src;
            const rating = product.querySelector(".a-icon-star-small span")?.textContent?.trim();
            const price = product.querySelector(".a-offscreen")?.textContent?.trim();

            // Verificação antes de adicionar ao array
            if (title && image && rating && price) {
                products.push({ title, image, rating, price });
            }
        });

        return products;

    } catch (error) {
        console.error("❌ Erro ao acessar a página:", error.response?.status || error.message);
        return [];
    }
}

app.get("/scrape-br", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: "A palavra-chave é obrigatória" });
    }

    const data = await scrapeAmazonBR(keyword);
    res.json(data);
});

async function scrapeAmazonUS(keyword) {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                // HTTP header to mimic a real request
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.amazon.com.br/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "DNT": "1",
                "Connection": "keep-alive"
            }
        });

        // Create DOM object to manipulate the page
        const dom = new JSDOM(data);
        const document = dom.window.document;

        let products = [];

        // Loop over search results
        document.querySelectorAll('[data-component-type="s-search-result"]').forEach(product => {
            const title = product.querySelector("h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal span")?.textContent?.trim();
            const image = product.querySelector("img")?.src;
            const rating = product.querySelector(".a-icon-star-small span")?.textContent?.trim();
            const price = product.querySelector(".a-offscreen")?.textContent?.trim();

            // Check before adding to array
            if (title && image && rating && price) {
                products.push({ title, image, rating, price });
            }
        });

        return products;

    } catch (error) {
        console.error("❌ Error accessing the page:", error.response?.status, error.message);
        return [];
    }
}

app.get("/scrape-us", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: "Keyword is required" });
    }

    const data = await scrapeAmazonUS(keyword);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
