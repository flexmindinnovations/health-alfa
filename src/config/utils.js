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
        backgroundColor: '#f8f9fa',
        backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, rgba(0,0,0,0) 1px)',
        backgroundSize: '20px 20px 20px 20px',
        backgroundPosition: '0 0, 10px 10px, 5px 5px, 15px 15px'
    }
}