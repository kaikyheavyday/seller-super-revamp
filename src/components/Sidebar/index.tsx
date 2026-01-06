"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: "ri-home-line",
    label: "ร้านค้าทั้งหมด",
    href: "/merchant-list",
  },
  {
    key: "statistics",
    icon: "ri-bar-chart-box-line",
    label: "วิเคราะห์ธุรกิจ",
    href: "/statistics",
  },
  {
    key: "orders",
    icon: "ri-list-check",
    label: "คำสั่งซื้อ",
    href: "/orders",
  },
];

const managementItems: MenuItem[] = [
  {
    key: "product-management",
    icon: "ri-shopping-bag-line",
    label: "สินค้า",
    href: "/product-management",
    children: [
      {
        key: "all-products",
        icon: "ri-file-list-line",
        label: "สินค้าทั้งหมด",
        href: "/product-management/all-products",
      },
      {
        key: "categories",
        icon: "ri-price-tag-3-line",
        label: "หมวดหมู่สินค้า",
        href: "/product-management/categories",
      },
    ],
  },
  {
    key: "service",
    icon: "ri-customer-service-line",
    label: "บริการ",
    href: "/service",
  },
  {
    key: "partner",
    icon: "ri-team-line",
    label: "บริหารคู่ค้า",
    href: "/partner",
  },
  {
    key: "market",
    icon: "ri-store-line",
    label: "การตลาด",
    href: "/market",
  },
  {
    key: "warehouse",
    icon: "ri-building-line",
    label: "คอมเพล็กซ์",
    href: "/warehouse",
  },
  {
    key: "finance",
    icon: "ri-money-dollar-circle-line",
    label: "การเงิน",
    href: "/finance",
  },
  {
    key: "coupon",
    icon: "ri-ticket-line",
    label: "แคตตาล็อก",
    href: "/coupon",
  },
];

const merchantCenterItems: MenuItem[] = [
  {
    key: "store-management",
    icon: "ri-store-2-line",
    label: "จัดการร้านค้า",
    href: "/store-management",
    children: [],
  },
  {
    key: "partner-seller",
    icon: "ri-group-line",
    label: "พมจคผู้ลึกค้า",
    href: "/partner-seller",
  },
  {
    key: "online-shop",
    icon: "ri-smartphone-line",
    label: "ตลาดออนไลน์",
    href: "/online-shop",
  },
  {
    key: "add-store",
    icon: "ri-add-circle-line",
    label: "ตกแต่งร้านค้า",
    href: "/add-store",
  },
  {
    key: "product-set",
    icon: "ri-file-list-line",
    label: "แอพลิเคชั่น",
    href: "/product-set",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const toggleExpand = (key: string) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(expandedKeys.filter((k) => k !== key));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedKeys.includes(item.key);

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleExpand(item.key)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors ${
              isActive ? "bg-green-50 text-green-600" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`${item.icon} text-lg`}></i>
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </div>
            {!isCollapsed && (
              <i
                className={`ri-arrow-down-s-line text-base transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              ></i>
            )}
          </button>
          {isExpanded && !isCollapsed && (
            <div className="bg-green-50">
              {item.children?.map((child) => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href || "#"}
        className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors ${
          isActive ? "bg-green-50 text-green-600" : ""
        }`}
      >
        <i className={`${item.icon} text-lg`}></i>
        {!isCollapsed && <span className="text-sm">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="relative w-32 h-8">
              <Image
                src="/home/allkons-logo.svg"
                alt="Allkons"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
          >
            <i
              className={`ri-menu-${
                isCollapsed ? "unfold" : "fold"
              }-line text-xl text-gray-600`}
            ></i>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard Section */}
          <div className="py-2">
            {!isCollapsed && (
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  Dashboard
                </span>
              </div>
            )}
            <nav>{menuItems.map((item) => renderMenuItem(item))}</nav>
          </div>

          {/* Management Section */}
          <div className="py-2">
            {!isCollapsed && (
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  Management
                </span>
              </div>
            )}
            <nav>{managementItems.map((item) => renderMenuItem(item))}</nav>
          </div>

          {/* Merchant Center Section */}
          <div className="py-2">
            {!isCollapsed && (
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  Merchant Center
                </span>
              </div>
            )}
            <nav>{merchantCenterItems.map((item) => renderMenuItem(item))}</nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
