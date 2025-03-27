
export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	
	   ///////////////////////////////////
    // MENU SỔ VĂN BẰNG
    {
        path: '/so-van-bang',
        name: 'Sổ Văn Bằng',
        icon: 'BookOutlined',
        routes: [
            {
                path: '/so-van-bang/quan-ly',
                name: 'Quản Lý Sổ Văn Bằng',
                component: './SoVanBang/QuanLySoVanBang',
            },
            {
                path: '/so-van-bang/thong-tin',
                name: 'Thông Tin Văn Bằng',
                component: './SoVanBang/ThongTinVanBang',
            },
        ],
    },

    ///////////////////////////////////
    // MENU CẤU HÌNH
    {
        path: '/cau-hinh',
        name: 'Cấu Hình',
        icon: 'SettingOutlined',
        routes: [
            {
                path: '/cau-hinh/bieu-mau-phu-luc',
                name: 'Biểu Mẫu Phụ Lục',
                component: './CauHinh/BieuMauPhuLuc',
            },
        ],
    },

    ///////////////////////////////////
    // MENU TRA CỨU
    {
        path: '/tra-cuu',
        name: 'Tra Cứu Văn Bằng',
        icon: 'SearchOutlined',
        component: './TraCuu',
    },
	
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
