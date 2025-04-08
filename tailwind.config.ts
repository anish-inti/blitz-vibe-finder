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
				// Updated Blitz color scheme - more contrast with black and neon accents
				blitz: {
					pink: "#FF00FF",         // Neon pink
					blue: "#00FFFF",         // Electric cyan blue
					purple: "#9B5DE5",       // Vibrant purple
					darkblue: "#000000",     // Black (renamed for compatibility)
					lightpink: "#FFD6FF",    // Soft pink
                    neonpink: "#FF00FF",     // Neon pink (same as pink for consistency)
                    electricblue: "#00FFFF", // Electric blue (same as blue for consistency)
                    vibrantpurple: "#8A2BE2", // Deep purple
                    cosmicindigo: "#4B0082",  // Deep indigo
                    stardust: "#FFD700",     // Gold/yellow
                    neonred: "#FF0055",      // New neon red
                    black: "#000000",        // Pure black
                    darkgray: "#121212",     // Very dark gray
                    offblack: "#0A0A0A"      // Slightly off-black for layering
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
						boxShadow: '0 0 5px rgba(255, 65, 180, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(255, 65, 180, 0.8)'
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
                        filter: 'brightness(1.3)'
                    }
                },
                'sparkle': {
                    '0%': {
                        transform: 'scale(0)',
                        opacity: '0'
                    },
                    '50%': {
                        transform: 'scale(1)',
                        opacity: '0.8'
                    },
                    '100%': {
                        transform: 'scale(0)',
                        opacity: '0'
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
                'sparkle': 'sparkle 1.5s ease-in-out infinite',
                'shimmer': 'shimmer 1.5s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
