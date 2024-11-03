import {MENU_ITEMS} from "../config/menu-items.js";
import {createElement, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {Tooltip} from "@nextui-org/react";

export function Sidebar() {
    const [menuItems, setMenuItems] = useState(MENU_ITEMS);
    const {pathname} = useLocation();

    useEffect(() => {
        const updatedMenuItems = menuItems.map(item => ({
            ...item,
            active: item.route === pathname,
        }));
        setMenuItems(updatedMenuItems);
    }, [pathname]);

    const handleMenuItemClick = (menuItem) => {
        const updatedMenuItems = menuItems.map(item => ({
            ...item,
            active: item === menuItem,
        }));
        setMenuItems(updatedMenuItems);
    };

    return (
        <div className="drawer !border-none lg:drawer-open xl:drawer-open 2xl:drawer-open h-full w-full">
            <div className="drawer-content flex flex-col items-center justify-center">
                <ul className="menu py-4 px-1 bg-[var(--bgColor)] bg-base-200 text-base-content min-h-full w-full flex items-center justify-start p-0 space-y-2">
                    {menuItems.map((menuItem) => (
                        <li key={menuItem.id}
                            onClick={() => handleMenuItemClick(menuItem)}
                            className={`${menuItem.active ? 'bg-primary text-white active:text-white focus:text-white' : ''} rounded-lg w-full max-w-[90%] mx-auto`}>
                            <Tooltip content={menuItem.title} placement="right">
                                <Link to={menuItem.route}
                                      className="flex flex-col bg-transparent items-center !text-inherit active:!text-inherit focus:!text-inherit focus-within:!text-inherit justify-center gap-1.5 p-1.5">
                                    <p className="icon m-0 max-h-5 max-w-5 flex items-center justify-center">{createElement(menuItem.icon)}</p>
                                    <p className="title m-0 p-0">{menuItem.title}</p>
                                </Link>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            </div>
        </div>
    );
}
