export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="240" rx="48" fill="url(#brand_gradient)" />
            <path d="M70 170L120 70L170 170" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M90 130H150" stroke="white" strokeWidth="15" strokeLinecap="round" />
            <defs>
                <linearGradient id="brand_gradient" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1B4F72" />
                    <stop offset="1" stopColor="#2E86C1" />
                </linearGradient>
            </defs>
        </svg>
    );
}
