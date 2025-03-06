
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
	{
		path: '/game',
		name: 'Trò chơi',
		icon: 'ScissorOutlined', // Icon hiển thị trên menu
		component: './Game', // Đường dẫn đến component Game
	  },
	
	  {
		path: '/question-bank',
		name: 'Ngân hàng câu hỏi',
		icon: 'BookOutlined',
		routes: [
		  {
			path: '/question-bank/categories',
			name: 'Danh mục khối kiến thức',
			component: '@/pages/QuestionBank/Categories',
		  },
		  {
			path: '/question-bank/subjects',
			name: 'Danh mục môn học',
			component: '@/pages/QuestionBank/Subjects',
		  },
		  {
			path: '/question-bank/questions',
			name: 'Quản lý câu hỏi',
			component: '@/pages/QuestionBank/Questions',
		  },
		  {
			path: '/question-bank/exams',
			name: 'Quản lý đề thi',
			component: '@/pages/QuestionBank/Exams',
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
