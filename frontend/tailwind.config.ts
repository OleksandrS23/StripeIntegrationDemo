import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stripe: {
          purple: '#635bff',
          blue: '#0073e6',
          green: '#00d4aa',
        },
      },
    },
  },
  plugins: [],
}
export default config

