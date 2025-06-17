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
				// Blitz Brand Colors - Spotify-Inspired Solid Colors
				blitz: {
					primary: 'hsl(var(--blitz-primary))',        // Vibrant Pink #FF1DB4
					secondary: 'hsl(var(--blitz-secondary))',    // Deep Purple #8B5CF6
					accent: 'hsl(var(--blitz-accent))',          // Electric Blue #00BFFF
					success: 'hsl(var(--blitz-success))',
					warning: 'hsl(var(--blitz-warning))',
					error: 'hsl(var(--blitz-error))',
					
					// Community & Social Colors
					community: 'hsl(var(--blitz-community))',    // Community Purple
					trending: 'hsl(var(--blitz-trending))',      // Trending Orange
					featured: 'hsl(var(--blitz-featured))',      // Featured Green
					live: 'hsl(var(--blitz-live))',              // Live Red
					
					// Surface colors
					surface: 'hsl(var(--blitz-surface))',
					'surface-dark': 'hsl(var(--blitz-surface-dark))',
					'surface-elevated': 'hsl(var(--blitz-surface-elevated))',
					text: 'hsl(var(--blitz-text))',
					'text-secondary': 'hsl(var(--blitz-text-secondary))',
					border: 'hsl(var(--blitz-border))',
					
					// Dynamic variations
					'primary-hover': 'hsl(var(--blitz-primary-hover))',
					'primary-active': 'hsl(var(--blitz-primary-active))',
					'secondary-hover': 'hsl(var(--blitz-secondary-hover))',
					'secondary-active': 'hsl(var(--blitz-secondary-active))',
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
				'pulse-community': {
					'0%, 100%': { boxShadow: '0 0 15px hsl(var(--blitz-community) / 0.3)' },
					'50%': { boxShadow: '0 0 25px hsl(var(--blitz-community) / 0.5)' }
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
				'pulse-community': 'pulse-community 3s ease-in-out infinite',
				'shimmer': 'shimmer 1.5s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;