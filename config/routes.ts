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
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// TRAVEL PLANNING MODULE
	{
		path: '/travel',
		name: 'Lập Kế Hoạch Du Lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/travel',
				redirect: '/travel/home',
			},
			{
				path: '/travel/home',
				name: 'Khám phá điểm đến',
				component: './Travel/index',
				icon: 'EnvironmentOutlined',
			},
			{
				path: '/travel/itinerary',
				name: 'Lịch trình',
				component: './Travel/components/Itinerary',
				icon: 'CalendarOutlined',
			},
			{
				path: '/travel/destination/:id',
				name: 'Chi tiết điểm đến',
				component: './Travel/components/Destination',
				hideInMenu: true,
			},
			{
				path: '/travel/admin',
				name: 'Quản trị',
				component: './Travel/components/Admin',
				icon: 'SettingOutlined',
			},
		],
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
