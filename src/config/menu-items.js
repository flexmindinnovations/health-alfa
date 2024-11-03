import {HouseIcon, ShoppingCart} from "lucide-react";

export const MENU_ITEMS = [
    {
        id: 1,
        key: 'HOME',
        title: 'Home',
        icon: HouseIcon,
        route: '/',
        active: false,
    },
    {
        id: 2,
        key: 'ORDERS',
        title: 'Orders',
        icon: ShoppingCart,
        route: '/orders',
        active: false,
    }
]

