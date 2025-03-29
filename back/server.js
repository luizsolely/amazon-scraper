import express from "express";
import { JSDOM } from "jsdom";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"]
}));

// Headers específicos por domínio
function getAmazonHeaders(domain) {
    const base = {
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    };

    return domain === 'com.br' ? {
        ...base,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Referer": "https://www.amazon.com.br/"
    } : {
        ...base,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.amazon.com/"
    };
}

// Função única com Puppeteer (para ambos domínios)
async function scrapeAmazon(keyword, domain = 'com.br') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Configura headers específicos
    await page.setExtraHTTPHeaders(getAmazonHeaders(domain));
    await page.setUserAgent(getAmazonHeaders(domain)["User-Agent"]);
    
    await page.goto(`https://www.amazon.${domain}/s?k=${encodeURIComponent(keyword)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
    });

    const content = await page.content();
    const dom = new JSDOM(content);
    const document = dom.window.document;

    let products = [];
    document.querySelectorAll('[data-component-type="s-search-result"]').forEach(product => {
        const title = product.querySelector("h2 span")?.textContent?.trim();
        const image = product.querySelector("img")?.src;
        const rating = product.querySelector(".a-icon-star-small span")?.textContent?.trim();
        const price = product.querySelector(".a-offscreen")?.textContent?.trim();

        if (title && image && price) {
            products.push({ 
                title, 
                image, 
                rating: rating || "Sem avaliação", 
                price 
            });
        }
    });

    await browser.close();
    return products;
}

// Rotas originais (inalteradas)
app.get("/scrape-br", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Palavra-chave obrigatória" });
    
    const data = await scrapeAmazon(keyword, 'com.br');
    res.json(data);
});

app.get("/scrape-us", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Keyword required" });
    
    const data = await scrapeAmazon(keyword, 'com');
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});