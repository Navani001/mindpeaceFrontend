const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable class-based dark mode
 theme: {
		extend: {
			colors: {
				'pink-bg': 'rgba(255, 80, 114, 0.08)',
				'blue-bg': 'rgba(102, 44, 196, 0.08)',
				'green-bg': 'rgba(9, 185, 109, 0.08)',
				'orange-bg': 'rgba(254, 74, 35, 0.08)',
				gradient: {
					from: '#FFE9DD',
					from_dark: '#FF7014',
					to: '#F5E1FE',
					to_dark: '#A100FF',
					start: '#FFE1C2BF',
					end: '#C7E5FFBF',
					chat_from: '#FB5812',
					chat_to: '#BE1F9D',
					from_light: '#4A2680',
					end_dark: '#011430',
					start_from: '#265e80',
					to_end: '#012230',
					from_feedback:'#FFE9DD',
					to_feedback:'#F5E1FE',
				},
				icons: {
					clock: '#FF5072',
					clocklight: '#FF507214',
					candidates: '#3629B7',
					candidateslight: '#3629B714',
				},
			},
			borderRadius: {
				custom: '80px 12px 12px 12px',
			},
			animation: {
				popIn: 'appearance-in 300ms ease-out normal both',
				popOut: 'appearance-out 60ms ease-in normal both',
				shine: 'shine 3.5s infinite',
				rotate: 'rotateFullRepeat 2.3s linear infinite',
			},
			keyframes: {
				popIn: {
					'0%, 60%': {
						opacity: '0.75',
						backfaceVisibility: 'hidden',
						transform: 'translateZ(0) scale(0.95)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateZ(0) scale(1)',
					},
				},
				popOut: {
					'0%': {
						opacity: '1',
						transform: 'scale(1)',
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0.85)',
					},
				},
				bounce: {
					'0%, 100%': {
						transform: 'translateY(-30%)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
					},
					'50%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
					},
				},
				shine: {
					'0%': { transform: 'translate(-150%, -150%)' },
					'100%': { transform: 'translate(150%, 150%)' },
				},
				rotateFullRepeat: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			fontFamily: {
				mont: ['var(--font-montserrat)', 'sans-serif'],
				source: ['var(--font-source-sans-3)', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			fontWeight: {
				regular: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
			},
			fontSize: {
				h1: ['2rem', { lineHeight: '2.6rem', letterSpacing: '0%' }],
				h3: ['1.5rem', { lineHeight: '1.5rem', letterSpacing: '0%' }],
				h4: ['1.25rem', { lineHeight: '1.25rem', letterSpacing: '0%' }],
				h5: ['1.125rem', { lineHeight: '1.125rem', letterSpacing: '0%' }],
				h6: ['1rem', { lineHeight: '1rem', letterSpacing: '0%' }],
				h7: ['0.875rem', { lineHeight: '0.875rem', letterSpacing: '0%' }],
				body1: ['1.125rem', { lineHeight: '1.125rem', letterSpacing: '0%' }],
				body2: ['1rem', { lineHeight: '1rem', letterSpacing: '0%' }],
				body3: ['0.875rem', { lineHeight: '0.875rem', letterSpacing: '0%' }],
				body4: ['0.75rem', { lineHeight: '0.75rem', letterSpacing: '0%' }],
				'button-l': [
					'1rem',
					{ lineHeight: '1rem', letterSpacing: '0%', fontWeight: '600' },
				],
				'button-m': [
					'0.875rem',
					{ lineHeight: '1rem', letterSpacing: '0%', fontWeight: '600' },
				],
				'button-s': [
					'0.875rem',
					{ lineHeight: '1rem', letterSpacing: '0%', fontWeight: '600' },
				],
				'input-l': [
					'1.125rem',
					{ lineHeight: '1.5rem', letterSpacing: '0%', fontWeight: '400' },
				],
				'input-m': [
					'1rem',
					{ lineHeight: '1.25rem', letterSpacing: '0%', fontWeight: '400' },
				],
				'input-s': [
					'0.875rem',
					{ lineHeight: '1rem', letterSpacing: '0%', fontWeight: '400' },
				],
				'input-helper': [
					'0.875rem',
					{ lineHeight: '1.125rem', letterSpacing: '1.3%', fontWeight: '400' },
				],
			},

			boxShadow: {

				'light-xs': '0px 2px 4px rgba(0, 0, 0, 0.08)', // Extra small shadow
				'light-sm': '0px 4px 6px rgba(0, 0, 0, 0.1)', // Small shadow
				'light-md': '0px 6px 12px rgba(0, 0, 0, 0.15)', // Medium shadow
				'light-lg': '0px 8px 16px rgba(0, 0, 0, 0.2)', // Large shadow
				'light-xl': '0px 10px 24px rgba(0, 0, 0, 0.25)', // Extra large shadow
				'light-xxl': '0px 1px 2px 0px rgba(21, 21, 21, 0.08), 0px 2px 4px 0px rgba(21, 21, 21, 0.08)', // Extra large shadow

				'gradient-shadow':
					'0 4px 6px 0 rgba(255, 255, 255, 0.00), 0 6px 10px 2px rgba(255, 255, 255, 0.44)',
				'light-xll': '0px 20px 24px -4px #15151514', // Extra large shadow
				'light-xlll': '2px 2px 16px 0px rgba(0, 0, 0, 0.20)',
			},
			backgroundImage: {
				'gradient-img':
					'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 60.51%, #FFF 86.51%)',
				'gradient-matrix':
					'linear-gradient(195.15deg, #FFFFFF 10.9%, #FFEFF6 51.64%, #F5E1FE 89.6%)',
				'progress-gradient':
					'linear-gradient(90deg, hsl(var(--core-content1-400)) 0%, hsl(var(--core-primary)) 50%, hsl(var(--core-success)) 100%)',
				'outcomeCard-gradient':
					'linear-gradient(329deg, rgba(199, 229, 255, 0.75) -9.74%, rgba(255, 225, 194, 0.75) 75.8%)',
				'loader-gradient':
					'linear-gradient(312deg, rgba(253,187,45,0) 41%, rgba(255,255,255,0.644) 44%, rgba(255,248,232,0) 48%,  rgba(255,255,255,0.644) 56%, rgba(253,187,45,0) 60%, rgba(253,187,45,0) 100%)',
				'icon-gradient': 'linear-gradient(90deg, #FF7014 0%, #A100FF 121.23%)',
				'RevGpt-gradient': 'linear-gradient(90deg, #FB5812 0%, #BE1F9D 100%)',
				'SynchronizedLineChart-gradient': 'linear-gradient(180deg, rgba(11, 107, 203, 0.30) -43.58%, rgba(255, 255, 255, 0.00) 124.33%)',
				'custom-gradient': 'linear-gradient(0deg, rgba(0, 0, 0, 0.00) -1.53%, #000 100%)',
			},
		},
	},
	plugins: [
		heroui({
			prefix: 'core', // prefix for themes variables
			defaultTheme: 'light', // default theme from the themes object
			defaultExtendTheme: 'light', // default theme to extend on custom themes
			themes: {
				light: {
					extend: 'light',
					layout: {
						boxShadow: {
							small: '0px 1px 2px 0px #15151514',
							large: '',
							medium: '',
						},
						disabledOpacity: '0.3', // opacity-[0.3]
						radius: {
							small: '2px', // rounded-small
							medium: '0.5rem', // rounded-medium
							large: '6px', // rounded-large
						},
						borderWidth: {
							small: '1px', // border-small
							medium: '1px', // border-medium
							large: '2px', // border-large
						},
					},
					colors: {
						primary: {
							DEFAULT: '#FF7014',
							foreground: '#FFEFE5',
							'50': '#F0DFD5',
							'100': '#FF7014',
							'200': '#AD4400',
							'400': '#FD6F14',
							'500': '#662C41',
							'600': '#FF5072',
							'700': "#E3EFFB",
							'800': '#fe4a23',
							'700': '#fe4a23',
							'800': '#FA6510'
						},
						secondary: {
							DEFAULT: '#65686F',
							foreground: '#E0E1E2',
							'50': '#C5CBD1',
							'100': '#65686F',
							'200': '#32363F',
							'300': '#F5F5F5',
							'400': '#555E68',
						},
						success: {
							DEFAULT: '#51BC51',
							foreground: '#E3FBE3',
							'50': '#D5F0D5',
							'100': '#51BC51',
							'200': '#1F7A1F',
							'300': '#C3E8C3',
							'400': '#2A702A',
							'500': '#31D06E',
							'600': '#498F49',
						},
						warning: {
							DEFAULT: '#EA9A3E',
							foreground: '#FFEFE5',
							'100': '#F0DFD5',
							'200': '#EA9A3E',
							'300': '#9A5B13',
							'400': '#FFF5E3',
							'500': '#E8D1C3',
							'600': '#FDF0E1'

						},
						danger: {
							DEFAULT: '#A51818',
							foreground: '#FCE4E4',
							'50': '#F0D1D1',
							'100': '#EB6A6A',
							'200': '#A51818',
							'300': '#E8BABA',
							'400': '#DE6464',
							'1000': '#FD5367',
							'1100': '#7D1212',
							'1001': '#7D1212',
							'1002': '#fce4e4',
						} ,
						background: {
							DEFAULT: '#FFFFFF',
							foreground: '#000000',
							'50': '#E0F5E8',
							'100': '#FFF6F1',
							'200': '#9A00EF',
							'300': '#FE7E8D',
							'400': '#67CC98',
							'500': '#FCBE74',
							'600': '#808080',
							'700': '#42A4EB',
							'800': '#88E2C9',
							'900': '#DFDFDF',
						},
						content1: {
							DEFAULT: '#FFFFFF',
							foreground: '#EDF5FD',
							'50': '#D5E3F0',
							'100': '#97C3F0',
							'200': '#0B6BCB',
							'300': '#4E585E',
							'400': '#FEDE00',
							'500': '#D9D9D9',
							'600': '#09B96D14',
							'700': '#FF507214',
							'800': '#3629B714',
							'900': '#FF5072',
							'1000': '#662CC4',
							'1001': '#09B96D',
							'1002': '#FE4A23',
							'1003': '#3629B7',
							'1004': '#662CC414',
							'1005': '#003569',
							'1006': '#F9D2FC',
							'1007': '#D2DEFC',
							'1008': '#E58600',
							'1010': '#f97316',
							'1011': '#ffedd5',
							'1012': '#F5F0BE',
							'1013': '#CFF6FC',
							'1014': '#CFE2FC',
							'1015': '#F9CFFC',
							'1016': '#FCE0CF',
							'1017': '#FCCFEA',
							'1018': '#CFDCFC',
							'1019': '#D25B16',
							'1020': '#911F99',
							'1021': '#0D5865',
							'1022': '#0D3365',
							'1023': '#655E0D',
							'1024': '#FA109C',
							'1025': '#1647C5',
							'1009': '#5F0D65',
							'2000': '#E4CD3A',
							'2001': '#DB4112',
							'2002': '#F0C83B',
							'2003': '#FFD96B',
							'2004': '#61D9B7',
							'2006': '#004c99',
							'2005': '#7A501F',
							'2007': '#FFE2E0',
							// '1006': '#E58600',
							// '1007': '#FFFFFF',
							// '1009': '#ff944f',
							// '1010': '#f97316',
							// '1011': '#ffedd5',
							// '1008': '#ff944f',
							// '1012': '#004C99',
						},
						content2: {
							DEFAULT: '#555E68',
							foreground: '#EDF1F5',
							'50': '#E3E7EB',
							'100': '#DDE7EE',
							'200': '#CDD7E1',
							'300': '#9FA6AD',
							'400': '#636B74',
							'500': '#555E68',
							'600': '#32383E',
							'700': '#171A1C',
							'800': '#49525A',
							'900': '#EDF4FA',
							'1000': '#FB5812',
							'1001': '#BE1F9D',
							'1002': "#FDF0E1",
							'1003': '#0a6bcb',
							'1004': '#DADADD',
							'1005': '#AE4CD5',
							'1006': '#EB00D9',
							'1007': '#34BB75',
							'1008': '#FBA845',
							'1009': "#67CC97",
							'2000': '#FD7E8D',
							'2001': '#FDB700',
							'2002': '#FC6F15',
							'2003': '#FFF1F4',
							'2004': '#FFE4EA',
							'2005': '#F3EEFB',
							'2006': '#E8DEF7',
							'2007': '#ECFAF4',
							'2008': '#DAF5EA',
							'2009': '#FFF1EE',
							'3001': '#FFE4DE',
							'3002': '#2A8FF7',
							'3003': '#A51818',
							// '1007': '#f1f5f9',
							// '1003': '#1e293b',
							// '1004': '#f8fafc',
							// '1005': '#0f172a',
							// '1006': '#cbd5e1',
							// '1002': '#FA651014',
							'3004': '#FBFCD2',
							'3005': '#fa651014',
							'3006': '#fa403214',
							'1100': '#E0E9FF',
							'1200': '#D3FCD2',
							'1300': '#FFECE1',
							'1400': '#D2F1FC',
							'1500': '#F9D2FC',
							'batch-card-bg':'#FE4A23',
							'1600':'#10650D'


						} ,

					},
				},
				dark: {
					layout: {},
					colors: {},
				},
			},
		}),
		// require('@tailwindcss/typography'),
		// require('tailwindcss-animate'),
    
	],
}