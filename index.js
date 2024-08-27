const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 从环境变量中获取目标 URL 和语言参数
const targetURLs = process.env.TARGET_URLS ? process.env.TARGET_URLS.split(',') : ['https://deeplx.vercel.app'];
const defaultSourceLang = process.env.SOURCE_LANG || 'ZH'; // 使用大写的环境变量名
const defaultTargetLang = process.env.TARGET_LANG || 'EN'; // 使用大写的环境变量名

app.use(express.json());
app.use(express.text());

app.post('/translate', async (req, res) => {
    // 从请求体中提取参数，使用环境变量作为默认值
    const { text, source_lang = defaultSourceLang, target_lang = defaultTargetLang } = req.body;

    // 检查必需的参数
    if (!text) {
        return res.status(400).json({ error: '缺少必需的参数: text' });
    }

    // 创建请求配置，考虑设置请求超时
    const createRequestConfig = (targetURL) => ({
        method: 'POST',
        url: targetURL,
        data: {
            text,
            source_lang,
            target_lang,
        },
        timeout: 5000, // 设置5秒超时
    });

    // 封装请求以捕获并处理单个请求的错误
    const makeRequest = async (config) => {
        try {
            return await axios(config);
        } catch (error) {
            return Promise.reject(`请求到 ${config.url} 失败: ${error.message}`);
        }
    };

    try {
        const responses = await Promise.any(targetURLs.map(targetURL => makeRequest(createRequestConfig(targetURL))));

        // 响应成功，设置响应头并返回数据
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }).status(responses.status).send(responses.data);

    } catch (error) {
        // 所有请求都失败了
        res.status(500).json({ error: '所有请求都失败了', details: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
