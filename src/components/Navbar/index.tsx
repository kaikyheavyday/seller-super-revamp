"use client";
import { Button, Popover, Badge } from "antd";
import { useState } from "react";
import { IAuthResponseUserProfile } from "@/interfaces/auth/auth.response.interface";
import Typography from "@/components/Typography";
import { useUserStore } from "@/store/user.store";
import { useAuth } from "@/hooks/useAuth";

interface IMerchantData {
  merchantId: number;
  merchantUuid: string;
  merchantSlug: string;
}

interface NavbarProps {
  isCollapsed: boolean;
}

export default function Navbar({ isCollapsed }: NavbarProps) {
  const { logout } = useAuth();
  const { user: userProfile, merchant } = useUserStore();
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const organizations = userProfile?.organizations || [];
  const currentUser = userProfile?.user;

  // Get current merchant organization
  const currentMerchant = organizations.find(
    (org: any) => org.organization.uuid === merchant?.merchantUuid
  );

  const userPopoverContent = (
    <div className="w-80">
      {/* User Info Header */}
      <div className="flex flex-col items-center py-4 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3">
          <i className="ri-user-line text-white text-2xl"></i>
        </div>
        <div className="text-center">
          <Typography
            variant="paragraph-middle-medium"
            className="text-gray-900"
          >
            {currentUser?.name || "ผู้ใช้งาน"}
          </Typography>
          <Typography
            variant="paragraph-small-regular"
            className="text-gray-500"
          >
            {currentUser?.phoneNumber ? `0${currentUser.phoneNumber}` : ""}
          </Typography>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
          <i className="ri-building-line text-lg"></i>
          <Typography variant="paragraph-small-regular">
            ร้านค้าทั้งหมด
          </Typography>
        </div>
        <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
          <i className="ri-user-settings-line text-lg"></i>
          <Typography variant="paragraph-small-regular">
            จัดการองค์กร
          </Typography>
        </div>
        <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
          <i className="ri-shield-user-line text-lg"></i>
          <Typography variant="paragraph-small-regular">จัดการบัญชี</Typography>
        </div>
        <div
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={logout}
        >
          <i className="ri-logout-box-line text-lg"></i>
          <Typography variant="paragraph-small-regular">ออกจากระบบ</Typography>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 right-0 py-2 bg-white border-b border-gray-200 z-30 transition-all duration-300 ${
        isCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left side - Merchant Display (No Popover) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success-subtle flex items-center justify-center text-white font-medium text-sm">
              <i className="ri-store-2-line text-xl text-primary-dark"></i>
            </div>
            <div className="text-left">
              <Typography
                variant="paragraph-medium"
                className="!text-primary !font-semibold"
              >
                {merchant?.merchantSlug || "ร้านค้าของฉัน"}
              </Typography>
              <div className="flex items-center gap-1">
                <i className="ri-building-line text-xs text-gray-500"></i>
                <Typography variant="paragraph-small" className="text-gray-500">
                  {currentMerchant?.role.displayName || "เจ้าของ"}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center gap-4">
          <Badge count={5} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={
                <i className="ri-notification-line text-xl text-gray-600"></i>
              }
              className="flex items-center justify-center"
            />
          </Badge>

          <Popover
            content={userPopoverContent}
            trigger="click"
            placement="bottomRight"
            open={userPopoverOpen}
            onOpenChange={setUserPopoverOpen}
            overlayClassName="user-profile-popover"
          >
            <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <i className="ri-user-line text-white"></i>
              </div>
              <div className="text-left">
                <Typography
                  variant="paragraph-small-medium"
                  className="text-gray-900"
                >
                  {currentUser?.name || "ผู้ใช้งาน"}
                </Typography>
                <Typography
                  variant="paragraph-extra-small-regular"
                  className="text-gray-500"
                >
                  {currentUser?.email || "user@example.com"}
                </Typography>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
}
