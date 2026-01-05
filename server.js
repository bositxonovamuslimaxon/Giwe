const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Public endpoint - token kerak emas
app.post('/api/instagram/scrape', async (req, res) => {
    const { url } = req.body;
    
    try {
        // Instagram postidan ma'lumotlarni scrape qilish
        const postData = await scrapeInstagramPost(url);
        
        res.json({
            success: true,
            data: postData,
            message: 'Ma\'lumotlar muvaffaqiyatli olindi'
        });
        
    } catch (error) {
        console.error('Scraping error:', error);
        
        // Agar scrape ishlamasa, demo ma'lumotlar qaytarish
        res.json({
            success: true,
            data: generateDemoData(),
            message: 'Demo ma\'lumotlar bilan ishlayapmiz'
        });
    }
});

// 2. Instagram scrape funksiyasi
async function scrapeInstagramPost(url) {
    // Instagram post URL dan shortcode olish
    const shortcode = url.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)?.[1];
    
    if (!shortcode) {
        throw new Error('Noto\'g\'ri Instagram link');
    }
    
    // Public Instagram oEmbed API dan foydalanish
    const oembedUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
    
    const response = await axios.get(oembedUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    
    // Ma'lumotlarni qayta ishlash
    const data = response.data;
    
    return {
        postId: shortcode,
        username: data.graphql?.shortcode_media?.owner?.username || 'instagram_user',
        caption: data.graphql?.shortcode_media?.edge_media_to_caption?.edges[0]?.node?.text || '',
        likes: data.graphql?.shortcode_media?.edge_media_preview_like?.count || 0,
        comments: data.graphql?.shortcode_media?.edge_media_to_comment?.count || 0,
        thumbnail: data.graphql?.shortcode_media?.display_url || '',
        timestamp: new Date().toISOString()
    };
}

// 3. Demo ma'lumotlar generatori
function generateDemoData() {
    const usernames = ['ali_developer', 'sara_designer', 'john_doe', 'lisa_ray'];
    const comments = [
        'Men qatnashmoqchiman!', 'Ajoyib tanlov!', 'G\'olib men bo\'laman',
        'Qachon yakunlanadi?', 'Omad hammaga!', 'Birorta shart bormi?'
    ];
    
    const fakeComments = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        text: comments[Math.floor(Math.random() * comments.length)],
        timestamp: `${Math.floor(Math.random() * 24)} soat oldin`,
        likes: Math.floor(Math.random() * 50)
    }));
    
    return {
        postId: 'demo_' + Date.now(),
        username: 'demo_user',
        caption: 'Demo tanlov posti #giveaway',
        likes: Math.floor(Math.random() * 1000),
        comments: fakeComments.length,
        thumbnail: '',
        commentsList: fakeComments,
        isDemo: true
    };
}

// 4. Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend server ${PORT}-portda ishga tushdi`);
    console.log(`🌐 API endpoint: http://localhost:${PORT}/api/instagram/scrape`);
});