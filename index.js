const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// 从环境变量中获取目标URL
const targetURLs = process.env.TARGET_URLS ? process.env.TARGET_URLS.split(',') : ['https://deeplx.vercel.app'];

// 从环境变量中获取源语言和目标语言，如果没有则使用默认值
const sourceLang = process.env.SOURCE_LANG || 'auto';
const targetLang = process.env.TARGET_LANG || 'en';

// 配置 CORS，允许特定域名
const allowedOrigins = [
    'https://6b.globalai.us.kg',
    'http://localhost', // 允许本地开发
    'http://localhost:63342' // 如果你在这个端口上运行
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('不允许的来源'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'], // 明确允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
}));

app.use(express.json());
app.use(express.text());

// 处理 OPTIONS 请求
app.options('*', (req, res) => {
    res.sendStatus(200); // 正确响应预检请求
});

app.all('*', async (req, res) => {
    const createRequestConfig = (targetURL) => ({
        method: req.method,
        url: targetURL + req.path,
        data: {
            text: req.body.text,
            source_lang: sourceLang,
            target_lang: targetLang,
        },
        timeout: 5000,
    });

    const makeRequest = async (config) => {
        try {
            return await axios(config);
        } catch (error) {
            return Promise.reject(`请求到 ${config.url} 失败: ${error.message}`);
        }
    };

    try {
        const responses = await Promise.any(targetURLs.map(targetURL => makeRequest(createRequestConfig(targetURL))));

        res.set({
            'Access-Control-Allow-Origin': '*', // 这里可以改为特定域名
            'Content-Type': 'application/json',
        }).status(responses.status).send(responses.data);

    } catch (error) {
        res.status(500).json({ error: '所有请求都失败了', details: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
