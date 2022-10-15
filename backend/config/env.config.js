
const Env = {
    isMobile: () => window.innerWidth <= 960,
    isTablet: () => window.innerWidth >= 500 && window.innerWidth <= 960,
    isLandscape: () => window.innerHeight <= 566,

    APP_TYPE: process.env.NEXT_PUBLIC_SC_APP_TYPE || 'backend',
    API_HOST: process.env.NEXT_PUBLIC_SC_API_HOST,
    LANGUAGES: ['fr', 'en'],
    _LANGUAGES: [
        {
            code: 'fr',
            label: 'Français'
        },
        {
            code: 'en',
            label: 'English'
        }
    ],
    DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_SC_DEFAULT_LANGUAGE || 'fr',
    PAGE_SIZE: parseInt(process.env.NEXT_PUBLIC_SC_PAGE_SIZE || 30),
    CDN_PRODUCTS: process.env.NEXT_PUBLIC_SC_CDN_PRODUCTS,
    CDN_TEMP_PRODUCTS: process.env.NEXT_PUBLIC_SC_CDN_TEMP_PRODUCTS,
    USER_TYPE: {
        ADMIN: 'admin',
        USER: 'user'
    }
};

export default Env;