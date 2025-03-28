
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
<<<<<<< HEAD
=======
	{
		path: '/todo-list',
		name: 'To-Do List',
		component: './ToDoList/index',
		icon: 'UnorderedListOutlined',
	},
	{
		path: '/guess-number',
		name: 'Guess Number',
		component: '@/components/GuessNumber/GuessNumber',
		icon: 'QuestionOutlined',
	  },
	  {
		path: '/study-tracker/category',
		name: 'Study Category',
		component: '@/components/StudyTracker/StudyCategory',
	  },
	  {
		path: '/study-tracker/goals',
		name: 'Study Goals',
		component: '@/components/StudyTracker/StudyGoals',
	  },
	  {
		path: '/study-tracker/progress',
		name: 'Study Progress',
		component: '@/components/StudyTracker/StudyProgress',
	  },
	  
	  // Quản lý văn bằng
	  {
		name: 'Quản lý văn bằng',
		icon: 'BookOutlined',
		path: '/van-bang',
		routes: [
		  {
			name: 'Sổ văn bằng',
			path: '/van-bang/so-van-bang',
			component: './VanBang/SoVanBang',
		  },
		  {
			name: 'Quyết định tốt nghiệp',
			path: '/van-bang/quyet-dinh',
			component: './VanBang/QuyetDinhTotNghiep',
		  },
		  {
			name: 'Cấu hình biểu mẫu',
			path: '/van-bang/bieu-mau',
			component: './VanBang/BieuMau',
		  },
		  {
			name: 'Thông tin văn bằng',
			path: '/van-bang/danh-sach',
			component: './VanBang/ThongTinVanBang',
		  },
		  {
			name: 'Tra cứu văn bằng',
			path: '/van-bang/tra-cuu',
			component: './VanBang/TraCuu',
		  },
		],
	  },
>>>>>>> 965dcd54 (code văn bằng)
	
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
