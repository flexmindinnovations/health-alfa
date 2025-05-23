export const utils = {
    parentVariants: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                when: "beforeChildren",
            },
        },
    },
    childVariants: {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 150, damping: 20 }
        },
    },
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    },
    userTypes: {
        'CLIENT': 'client',
        'USER': 'user',
        'DOCTOR': 'doctor',
        'ADMIN': 'admin',
    },
    appointmentStatus: {
        BOOKED: 'Booked',
        PENDING: 'Pending',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
    },
    dotsBackground: {
        backgroundColor: '#f9fafb',
        backgroundImage: 'radial-gradient(#bbb 1px, transparent 1px)',
        backgroundSize: '3px 3px',
    }
}