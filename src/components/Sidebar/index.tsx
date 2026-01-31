"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "antd";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Icon component for Remix icons
const Icon = ({ name }: { name: string }) => (
  <i className={name} style={{ fontSize: "20px", marginRight: "10px" }} />
);

const Sidebar = memo(function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Check screen size and auto-collapse/expand based on lg breakpoint
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth < 1024;
      if (isLg && !isCollapsed) {
        onToggle();
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [onToggle, isCollapsed]);

  const menuItems: MenuItem[] = useMemo(() => {
    if (isCollapsed) {
      return [
        {
          key: "/",
          icon: <Icon name="ri-home-5-line" />,
          title: "ร้านค้าทั้งหมด",
        },
        {
          key: "/businessInsight",
          icon: <Icon name="ri-bar-chart-box-line" />,
          title: "วิเคราะห์ธุรกิจ",
        },
        {
          key: "/orders",
          icon: <Icon name="ri-list-ordered-2" />,
          title: "คำสั่งซื้อ",
        },
        {
          key: "/products",
          icon: <Icon name="ri-checkbox-multiple-line" />,
          title: "สินค้า",
          children: [
            {
              key: "/products/manage-products",
              label: <Link href="/products/manage-products">จัดการสินค้า</Link>,
            },
            {
              key: "/products/product-matching",
              label: (
                <Link href="/products/product-matching">นำเข้าสินค้า</Link>
              ),
            },
          ],
        },
        {
          key: "/vouchers",
          icon: <Icon name="ri-customer-service-2-line" />,
          title: "บริการ",
        },
        {
          key: "/customers",
          icon: <Icon name="ri-user-search-line" />,
          title: "บริหารลูกค้า",
        },
        {
          key: "/banners",
          icon: <Icon name="ri-advertisement-line" />,
          title: "การตลาด",
        },
        {
          key: "/articles",
          icon: <Icon name="ri-article-line" />,
          title: "คอนเทนส์",
        },
        {
          key: "/revenue",
          icon: <Icon name="ri-wallet-3-line" />,
          title: "การเงิน",
        },
        {
          key: "/catalogs",
          icon: <Icon name="ri-layout-grid-line" />,
          title: "แคตตาล็อก",
        },
        {
          key: "merchantCenter",
          icon: <Icon name="ri-store-2-line" />,
          title: "จัดการร้านค้า",
          children: [
            {
              key: "/merchantCenter/identity-verification-information",
              label: (
                <Link href="/merchantCenter/identity-verification-information">
                  ข้อมูลยืนยันตัวตน
                </Link>
              ),
            },
            {
              key: "/merchantCenter/store-info",
              label: (
                <Link href="/merchantCenter/store-info">ข้อมูลร้านค้า</Link>
              ),
            },
          ],
        },
        {
          key: "/categories",
          icon: <Icon name="ri-apps-2-line" />,
          title: "หมวดหมู่สินค้า",
        },
        {
          key: "/marketplace",
          icon: <Icon name="ri-global-line" />,
          title: "ตลาดออนไลน์",
        },
        {
          key: "/merchantTheme",
          icon: <Icon name="ri-palette-line" />,
          title: "ตกแต่งร้านค้า",
        },
        {
          key: "/merchantApplicationConfiguration",
          icon: <Icon name="ri-smartphone-line" />,
          title: "แอพลิเคชั่น",
        },
      ];
    }

    return [
      {
        key: "dashboards",
        label: "DASHBOARDS",
        type: "group" as const,
        children: [
          {
            key: "/merchant-list",
            icon: <Icon name="ri-home-5-line" />,
            label: <Link href="/merchant-list">ร้านค้าทั้งหมด</Link>,
          },
          {
            key: "/businessInsight",
            icon: <Icon name="ri-bar-chart-box-line" />,
            label: <Link href="/businessInsight">วิเคราะห์ธุรกิจ</Link>,
          },
          {
            key: "/orders",
            icon: <Icon name="ri-list-ordered-2" />,
            label: <Link href="/orders">คำสั่งซื้อ</Link>,
          },
        ],
      },
      {
        key: "management",
        label: "MANAGEMENT",
        type: "group" as const,
        children: [
          {
            key: "/products",
            icon: <Icon name="ri-checkbox-multiple-line" />,
            label: "สินค้า",
            children: [
              {
                key: "/products/manage-products",
                label: (
                  <Link href="/products/manage-products">จัดการสินค้า</Link>
                ),
              },
              {
                key: "/products/product-matching",
                label: (
                  <Link href="/products/product-matching">นำเข้าสินค้า</Link>
                ),
              },
            ],
          },
          {
            key: "/vouchers",
            icon: <Icon name="ri-customer-service-2-line" />,
            label: <Link href="/vouchers">บริการ</Link>,
          },
          {
            key: "/customers",
            icon: <Icon name="ri-user-search-line" />,
            label: <Link href="/customers">บริหารลูกค้า</Link>,
          },
          {
            key: "/banners",
            icon: <Icon name="ri-advertisement-line" />,
            label: <Link href="/banners">การตลาด</Link>,
          },
          {
            key: "/articles",
            icon: <Icon name="ri-article-line" />,
            label: <Link href="/articles">คอนเทนส์</Link>,
          },
          {
            key: "/revenue",
            icon: <Icon name="ri-wallet-3-line" />,
            label: <Link href="/revenue">การเงิน</Link>,
          },
          {
            key: "/catalogs",
            icon: <Icon name="ri-layout-grid-line" />,
            label: <Link href="/catalogs">แคตตาล็อก</Link>,
          },
        ],
      },
      {
        key: "merchant-center",
        label: "MERCHANT CENTER",
        type: "group" as const,
        children: [
          {
            key: "merchantCenter",
            icon: <Icon name="ri-store-2-line" />,
            label: "จัดการร้านค้า",
            children: [
              {
                key: "/merchantCenter/identity-verification-information",
                label: (
                  <Link href="/merchantCenter/identity-verification-information">
                    ข้อมูลยืนยันตัวตน
                  </Link>
                ),
              },
              {
                key: "/merchantCenter/store-info",
                label: (
                  <Link href="/merchantCenter/store-info">ข้อมูลร้านค้า</Link>
                ),
              },
            ],
          },
          {
            key: "/categories",
            icon: <Icon name="ri-apps-2-line" />,
            label: <Link href="/categories">หมวดหมู่สินค้า</Link>,
          },
          {
            key: "/marketplace",
            icon: <Icon name="ri-global-line" />,
            label: <Link href="/marketplace">ตลาดออนไลน์</Link>,
          },
          {
            key: "/merchantTheme",
            icon: <Icon name="ri-palette-line" />,
            label: <Link href="/merchantTheme">ตกแต่งร้านค้า</Link>,
          },
          {
            key: "/merchantApplicationConfiguration",
            icon: <Icon name="ri-smartphone-line" />,
            label: (
              <Link href="/merchantApplicationConfiguration">แอพลิเคชั่น</Link>
            ),
          },
        ],
      },
    ];
  }, [isCollapsed]);

  // Update selected key based on current route
  useEffect(() => {
    const currentPath = pathname;
    setSelectedKey(currentPath);

    if (!isCollapsed) {
      const newOpenKeys: string[] = [];
      const findActiveParent = (items: MenuItem[]) => {
        items.forEach((item: any) => {
          if (item?.type === "group" && item?.children) {
            findActiveParent(item.children);
          } else if (item?.children) {
            const hasActiveChild = item.children.some(
              (child: any) => child?.key === currentPath
            );
            if (hasActiveChild) newOpenKeys.push(item.key as string);
            findActiveParent(item.children);
          }
        });
      };
      findActiveParent(menuItems);
      if (newOpenKeys.length > 0) {
        setOpenKeys((prev) => [...new Set([...prev, ...newOpenKeys])]);
      }
    }
  }, [pathname, menuItems, isCollapsed]);

  const onOpenChange = useCallback((keys: string[]) => setOpenKeys(keys), []);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-200 z-[1000] overflow-auto ${
        isCollapsed ? "w-20" : "w-[290px]"
      }`}
    >
      {/* Header: Logo + Toggle */}
      <div
        className={`h-16 flex items-center border-b border-gray-200 ${
          isCollapsed ? "justify-center px-0" : "justify-between px-4"
        }`}
      >
        {!isCollapsed && (
          <div className="relative w-[190px] h-8">
            <Image
              src="/home/allkons-logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
        <button
          onClick={onToggle}
          className="border-none bg-transparent cursor-pointer p-3 flex items-center justify-center"
        >
          <i className="ri-menu-line text-2xl text-gray-800" />
        </button>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        inlineCollapsed={isCollapsed}
        items={menuItems}
        className="border-none"
      />
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
