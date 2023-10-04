/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,tsx}",
        "./docs/**/*.{html,tsx}"
    ],
    theme: {
        extend: {

        },
    },
    plugins: [
        require('tailwindcss-elevation'),
    ],
}

