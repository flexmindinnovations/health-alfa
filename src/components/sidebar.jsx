import {MENU_ITEMS} from "../config/menu-items.js";
import {createElement} from "react";
import {Link} from "react-router-dom";

export function Sidebar() {
    const menuItems = MENU_ITEMS;

    return (
        <div className="drawer lg:drawer-open xl:drawer-open 2xl:drawer-open h-full w-full">
            <div className="drawer-content flex flex-col items-center justify-center">
                <ul className="menu py-4 px-1 bg-[var(--bgColor)] bg-base-200 text-base-content min-h-full w-full flex items-center justify-start p-0 space-y-2">
                    {menuItems.map((menuItem) => (
                        <li key={menuItem.id} className="w-full">
                            <Link to={menuItem.route} className="flex flex-col items-center justify-center gap-1.5 p-1.5">
                                <p className="icon m-0 max-h-5 max-w-5 flex items-center justify-center">{createElement(menuItem.icon)}</p>
                                <p className="title m-0 p-0">{menuItem.title}</p>
                            </Link>
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
