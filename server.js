const express = require('express');
const app = express();
const port = 3000;

// إعداد محرك القوالب EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('<h1>National Bank of Cyprus - Sandbox</h1><p>We are currently under maintenance.</p>');
});

// صفحة الإعدادات التي تحتوي على نقطة الضعف (SSTI) للتجربة
app.get('/settings', (req, res) => {
    res.render('settings', { password: req.query.password || '' });
});

app.post('/settings', (req, res) => {
    // محاكاة خطرة لثغرة SSTI حيث يتم تمرير المدخلات مباشرة للمحرر دون تنقية
    const userpass = req.body.password || '';
    const template = `<div>Customer Settings</div><p>Password updated: ${userpass}</p>`;
    try {
        // العرض المتعمد للثغرة عبر رندر المدخلات مباشرة
        res.render('settings', { password: userpass });
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// تشغيل السيرفر
app.listen(port, () => {
    console.log(`Bank sandbox server running on port ${port}`);
});
