import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { MENU_ITEMS } from '@config/MenuItems.js';
import { useTranslation } from 'react-i18next';
import { UserMenu } from '@components/UserMenu.jsx';
import logo from '/images/logo.png';
import { ChevronRight, Home } from 'lucide-react';
import { useEncrypt } from '@hooks/EncryptData.jsx';
import { modals } from '@mantine/modals';
import { Settings } from '@components/Settings.jsx';
import { AnimatePresence, motion } from 'framer-motion';

export function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [opened, setOpened] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const { getEncryptedData } = useEncrypt();

  const filteredMenuItems = useCallback(() => {
    const userRole = getEncryptedData('roles')?.toUpperCase();
    if (!userRole) return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.roles.includes(userRole));
  }, [getEncryptedData]);

  useEffect(() => {
    const currentMenuItems = filteredMenuItems();
    const activePath = sessionStorage.getItem('currentItem') || pathname;

    const updatedMenuItems = currentMenuItems.map((item) => ({
      ...item,
      active: `/app${item.route}` === activePath,
    }));
    setMenuItems(updatedMenuItems);

    const segments = pathname.split('/').filter((s) => s && s !== 'app');
    let cumPath = '/app';
    const breadcrumbs = segments.map((segment, index) => {
      cumPath += `/${segment}`;
      const match = currentMenuItems.find((item) => `/app${item.route}` === cumPath);
      if (!match) return null;
      return {
        key: match.key,
        title: t(match.key),
        href: cumPath,
        active: index === segments.length - 1,
      };
    }).filter(Boolean);

    setBreadcrumbItems(breadcrumbs);
  }, [pathname]);

  const handleNavClick = (item) => {
    const path = `/app${item.route}`;
    sessionStorage.setItem('currentItem', path);
    setMenuItems((prev) =>
      prev.map((i) => ({ ...i, active: i.id === item.id }))
    );
    if (window.innerWidth < 768) setOpened(false);
  };

  const openSettings = () => {
    modals.open({
      title: <span className="text-lg font-semibold">{t('settings')}</span>,
      size: 'xl',
      fullScreen: window.innerWidth < 768,
      centered: true,
      children: <Settings />,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 bg-white border-r w-64 ${opened ? 'block' : 'hidden'} sm:block`}>
        <div className="flex items-center justify-center h-20 border-b">
          <Link to="/app">
            <img src={logo} alt="Health Alpha" className="h-12 w-auto" />
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={`/app${item.route}`}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium ${
                item.active
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon && <item.icon size={16} />}
              <span>{t(item.key)}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden"
              onClick={() => setOpened((o) => !o)}
            >
              <span className="sr-only">Toggle Menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-600 space-x-2">
              <Link to="/app" className="hover:text-blue-600">
                <Home size={16} />
              </Link>
              {breadcrumbItems.map((item, idx) => (
                <span key={item.key} className="flex items-center space-x-2">
                  <ChevronRight size={14} />
                  {item.active ? (
                    <span className="text-blue-600 font-medium">{item.title}</span>
                  ) : (
                    <Link to={item.href} className="hover:text-blue-600">
                      {item.title}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Right-side controls */}
          <UserMenu showHideSettingsModel={openSettings} />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
