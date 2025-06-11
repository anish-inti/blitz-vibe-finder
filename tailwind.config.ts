import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Blitz Brand Colors - Spotify-Inspired Deep Purple
				blitz: {
					primary: 'hsl(var(--blitz-primary))',      // Deep Purple #8B5CF6
					secondary: 'hsl(var(--blitz-secondary))',  // Vibrant Pink #FF66B2
					accent: 'hsl(var(--blitz-accent))',        // Electric Purple #C084FC
					surface: 'hsl(var(--blitz-surface))',
					'surface-dark': 'hsl(var(--blitz-surface-dark))',
					text: 'hsl(var(--blitz-text))',
					'text-secondary': 'hsl(var(--blitz-text-secondary))',
					border: 'hsl(var(--blitz-border))',
					success: 'hsl(var(--blitz-success))',
					warning: 'hsl(var(--blitz-warning))',
					error: 'hsl(var(--blitz-error))',
					
					// Spotify-inspired neutral scale
					neutral: {
						50: 'hsl(var(--blitz-neutral-50))',
						100: 'hsl(var(--blitz-neutral-100))',
						200: 'hsl(var(--blitz-neutral-200))',
						300: 'hsl(var(--blitz-neutral-300))',
						400: 'hsl(var(--blitz-neutral-400))',
						500: 'hsl(var(--blitz-neutral-500))',
						600: 'hsl(var(--blitz-neutral-600))',
						700: 'hsl(var(--blitz-neutral-700))',
						800: 'hsl(var(--blitz-neutral-800))',
						900: 'hsl(var(--blitz-neutral-900))',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				display: ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'hero': ['3rem', { lineHeight: '1.1', fontWeight: '900' }],
				'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
				'headline': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
				'title': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
				'body': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
				'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'blitz-gradient': 'linear-gradient(135deg, hsl(var(--blitz-primary)) 0%, hsl(var(--blitz-accent)) 100%)',
				'blitz-gradient-reverse': 'linear-gradient(135deg, hsl(var(--blitz-secondary)) 0%, hsl(var(--blitz-primary)) 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'bounce-in': {
					'0%': { opacity: '0', transform: 'scale(0.8)' },
					'50%': { transform: 'scale(1.02)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 15px hsl(var(--blitz-primary) / 0.2)' },
					'50%': { boxShadow: '0 0 25px hsl(var(--blitz-primary) / 0.4)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'bounce-in': 'bounce-in 0.5s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'gradient': 'gradient-shift 4s ease infinite',
				'shimmer': 'shimmer 1.5s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;