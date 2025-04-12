
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
				// Refined Apple-inspired Blitz color scheme
				"blitz-black": "#121212",        // Soft black/charcoal
                "blitz-pink": "#ff6ec7",         // Dusty neon pink
                "blitz-accent": "#ff6ec7",       // Same as pink for accents
                "blitz-gray": "#1F1F1F",         // Card background
                "blitz-lightgray": "#8E9196",    // Text secondary
                "blitz-offwhite": "#F1F1F1",     // Text primary
                "blitz-stardust": "#FFDEE2",     // Soft pink highlight
				// Keep legacy colors for backward compatibility but use more subtle variations
				"blitz-neonred": "#e64c66",      // Toned down red
				"blitz-purple": "#9b87c5",       // More muted purple
				"blitz-blue": "#33a1c0",         // Toned down blue
				blitz: {
					// New refined color palette
					black: "#121212",            // Soft black/charcoal
					charcoal: "#222222",         // Dark gray
					gray: "#1F1F1F",             // Card background
					lightgray: "#8E9196",        // Text secondary
					offwhite: "#F1F1F1",         // Text primary
					pink: "#ff6ec7",             // Main accent color
					softpink: "#FFDEE2",         // Soft pink
					
					// Legacy colors with more refined values
					neonred: "#e64c66",          // Toned down red
					purple: "#9b87c5",           // More muted purple
					blue: "#33a1c0",             // Toned down blue
					
					// UI specific colors
					card: "#1C1C1E",             // Card background (Apple dark mode card)
					separator: "rgba(255,255,255,0.1)", // Subtle separator
					highlight: "rgba(255,108,199,0.15)"  // Subtle highlight
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
				heading: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(234, 56, 76, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(234, 56, 76, 0.8)'
					}
				},
                'float': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-10px)'
                    }
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        filter: 'brightness(1)'
                    },
                    '50%': {
                        opacity: '0.8',
                        filter: 'brightness(1.5)'
                    }
                },
                'sparkle': {
                    '0%, 100%': {
                        opacity: '0.8',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        opacity: '0.4',
                        transform: 'scale(0.8)'
                    }
                },
                'shimmer': {
                    '0%': {
                        backgroundPosition: '-468px 0'
                    },
                    '100%': {
                        backgroundPosition: '468px 0'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
                'float': 'float 4s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'sparkle': 'sparkle 3s ease-in-out infinite',
                'shimmer': 'shimmer 1.5s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
