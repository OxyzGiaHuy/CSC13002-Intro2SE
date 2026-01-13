const sequelize = require('../config/database');
const Trail = require('../models/Trail');

const vietnameseTrails = [
    {
        name: 'Đỉnh Fansipan',
        location: 'Sa Pa, Lào Cai',
        region: 'Miền Bắc',
        description: 'Được mệnh danh là "Nóc nhà Đông Dương", Fansipan cao 3.143 mét. Một hành trình đầy thử thách qua những khu rừng nhiệt đới và rừng trúc xanh mướt, mang lại tầm nhìn toàn cảnh tuyệt đẹp.'
    },
    {
        name: 'Rừng Thông Đà Lạt',
        location: 'Đà Lạt, Lâm Đồng',
        region: 'Tây Nguyên',
        description: 'Một chuyến đi bộ yên bình qua những rừng thông mờ sương của Đà Lạt. Tận hưởng không khí mát mẻ, những hồ nước thơ mộng và bầu không khí bình yên của thành phố ngàn hoa.'
    },
    {
        name: 'Vườn Quốc gia Cúc Phương',
        location: 'Ninh Bình',
        region: 'Miền Bắc',
        description: 'Vườn quốc gia đầu tiên của Việt Nam với thảm thực vật phong phú, cây cổ thụ nghìn năm và động vật hoang dã đa dạng. Cúc Phương đẹp nhất vào mùa bướm.'
    },
    {
        name: 'Vườn Quốc gia Bạch Mã',
        location: 'Thừa Thiên Huế',
        region: 'Miền Trung',
        description: 'Khám phá những thác nước hùng vĩ như Thác Đỗ Quyên và hệ sinh thái đa dạng. Đỉnh Bạch Mã mang lại tầm nhìn bao quát toàn bộ vùng biển và đầm phá.'
    },
    {
        name: 'Vườn Quốc gia Cát Bà',
        location: 'Cát Bà, Hải Phòng',
        region: 'Miền Bắc',
        description: 'Đi bộ qua những dãy núi đá vôi và rừng nhiệt đới trên đảo Cát Bà. Đỉnh Ngự Lâm mang lại cái nhìn bao quát về hòn đảo và Vịnh Hạ Long.'
    },
    {
        name: 'Cung đường ven biển Ninh Thuận',
        location: 'Ninh Thuận',
        region: 'Duyên hải Nam Trung Bộ',
        description: 'Một hành trình độc đáo qua cảnh quan bán khô hạn của Núi Chúa, với địa hình đá, rừng khô và những bãi biển hoang sơ nước trong vắt.'
    },
    {
        name: 'Khu bảo tồn thiên nhiên Pù Luông',
        location: 'Thanh Hóa',
        region: 'Miền Bắc',
        description: 'Băng qua những thửa ruộng bậc thang tuyệt đẹp và những dãy núi đá vôi. Thăm các bản làng người Thái và tận hưởng vẻ đẹp yên bình của vùng nông thôn.'
    },
    {
        name: 'Tà Năng - Phan Dũng',
        location: 'Lâm Đồng - Bình Thuận',
        region: 'Duyên hải Nam Trung Bộ',
        description: 'Cung đường trekking đẹp nhất Việt Nam, băng qua những đồi cỏ và rừng thông, chuyển tiếp từ cao nguyên xuống vùng duyên hải.'
    },
    {
        name: 'Đèo Hải Vân',
        location: 'Đà Nẵng - Huế',
        region: 'Miền Trung',
        description: 'Đi bộ dọc theo con đèo ven biển đẹp nhất Việt Nam. Khám phá các di tích lịch sử và tận hưởng cung đường uốn lượn giữa núi rừng và biển cả.'
    },
    {
        name: 'Vịnh Hạ Long',
        location: 'Quảng Ninh',
        region: 'Miền Bắc',
        description: 'Tận hưởng tầm nhìn biểu tượng từ những đỉnh núi hướng ra vịnh kỳ quan với hàng nghìn đảo đá vôi nhô lên từ làn nước xanh ngọc bích.'
    },
    {
        name: 'Đỉnh Lang Biang',
        location: 'Đà Lạt, Lâm Đồng',
        region: 'Tây Nguyên',
        description: 'Chinh phục "nóc nhà Đà Lạt". Con đường đi qua rừng thông và rừng già để lên đỉnh, mang lại tầm nhìn tuyệt đẹp xuống Thung Lũng Vàng và Suối Bạc.'
    },
    {
        name: 'Đèo Ô Quy Hồ',
        location: 'Lai Châu',
        region: 'Miền Bắc',
        description: 'Đi bộ gần một trong tứ đại đỉnh đèo của vùng Tây Bắc. Tận hưởng phong cảnh núi non hùng vĩ, những thung lũng sâu và biển mây bồng bềnh.'
    },
    {
        name: 'Rừng tràm Trà Sư',
        location: 'An Giang',
        region: 'Miền Tây',
        description: 'Khám phá rừng tràm ngập nước đặc trưng của miền Tây Nam Bộ. Một chuyến đi bộ yên tĩnh trên những cây cầu tre dài xuyên rừng tràm xanh ngát.'
    },
    {
        name: 'Núi Bà Đen',
        location: 'Tây Ninh',
        region: 'Miền Nam',
        description: 'Ngọn núi cao nhất miền Nam Việt Nam. Một hành trình thử thách qua các tảng đá lớn để lên đỉnh núi, nơi có tượng Phật Bà bằng đồng cao nhất Châu Á.'
    },
    {
        name: 'Vịnh Bái Tử Long',
        location: 'Quảng Ninh',
        region: 'Miền Bắc',
        description: 'Một lựa chọn hoang sơ thay cho Vịnh Hạ Long. Đi bộ trên các hòn đảo với bãi biển hoang sơ, tận hưởng sự tĩnh lặng và vẻ đẹp tự nhiên kỳ vĩ.'
    },
    {
        name: 'Bidoup Núi Bà',
        location: 'Lâm Đồng',
        region: 'Tây Nguyên',
        description: 'Hành trình xuyên qua những khu rừng rêu cổ thụ. Khám phá những cây thông hai lá dẹt quý hiếm và hệ sinh thái đa dạng của vùng cao nguyên.'
    },
    {
        name: 'Tây Côn Lĩnh',
        location: 'Hà Giang',
        region: 'Miền Bắc',
        description: 'Mái nhà của Đông Bắc. Cung đường gập ghềnh qua những rừng trà cổ thụ và rừng trúc để chinh phục đỉnh núi chìm trong sương mù.'
    },
    {
        name: 'Cổng trời Quản Bạ',
        location: 'Hà Giang',
        region: 'Miền Bắc',
        description: 'Đi bộ lên Cổng trời để ngắm nhìn toàn cảnh Tuyệt Tình Cốc và thị trấn Tam Sơn giữa thung lũng tuyệt đẹp phía dưới.'
    },
    {
        name: 'Hồ Ba Bể',
        location: 'Bắc Kạn',
        region: 'Miền Bắc',
        description: 'Đi bộ quanh hồ nước ngọt tự nhiên lớn nhất Việt Nam. Trải nghiệm làn nước trong xanh, các hang động và bản làng dân tộc thiểu số trong vườn quốc gia.'
    },
    {
        name: 'Núi Dinh',
        location: 'Bà Rịa - Vung Tau',
        region: 'Miền Nam',
        description: 'Một địa điểm leo núi phổ biến gần Vũng Tàu. Cung đường dẫn đến các ngôi chùa Phật giáo, những dòng suối mát lạnh và tầm nhìn ra biển.'
    }
];

async function restoreVietnamese() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const trails = await Trail.findAll({ order: [['trail_id', 'ASC']] });
        console.log(`🔄 Reverting ${trails.length} trails to Vietnamese...`);

        for (let i = 0; i < trails.length; i++) {
            if (i < vietnameseTrails.length) {
                const vi = vietnameseTrails[i];
                const trail = trails[i];

                console.log(`[ID ${trail.trail_id}] Reverting to: ${vi.name}`);

                trail.name = vi.name;
                trail.location_province = vi.location;
                if (vi.region) trail.location_region = vi.region;
                if (vi.description) trail.description = vi.description;

                await trail.save();
            }
        }

        console.log('✅ Restoration complete.');

    } catch (error) {
        console.error('❌ Error updating:', error);
    } finally {
        await sequelize.close();
    }
}

restoreVietnamese();
