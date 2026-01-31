"use client";
import { Popover, Badge, Avatar } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@/components/Typography";
import { useUserStore } from "@/store/user.store";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/auth.api";

interface NavbarProps {
  isCollapsed: boolean;
}

// Badge Label Component
const BadgeLabel = ({
  prefix,
  text,
  color,
}: {
  prefix?: React.ReactNode;
  text: string;
  color: "error" | "warning" | "info" | "success";
}) => {
  const colorClasses = {
    error: "text-error bg-error/10",
    warning: "text-warning bg-warning/10",
    info: "text-info bg-info/10",
    success: "text-success bg-success/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colorClasses[color]}`}
    >
      {prefix}
      {text}
    </span>
  );
};

const renderLabelByStatus = (status: string) => {
  switch (status) {
    case "NONE":
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-error"></i>}
          color="error"
          text="ยังไม่ยืนยันตัวตน"
        />
      );
    case "WAIT_FOR_APPROVE":
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-warning"></i>}
          color="warning"
          text="รอการอนุมัติ"
        />
      );
    case "REQUEST_MORE":
      return (
        <BadgeLabel
          prefix={<i className="ri-draft-line text-info"></i>}
          color="info"
          text="ขอข้อมูลเพิ่มเติม"
        />
      );
    case "APPROVE":
      return (
        <BadgeLabel
          prefix={<i className="ri-verified-badge-line text-success"></i>}
          color="success"
          text="ยืนยันตัวตนแล้ว"
        />
      );
    case "REJECT":
      return (
        <BadgeLabel
          prefix={<i className="ri-close-line text-error"></i>}
          color="error"
          text="ไม่ได้รับการอนุมัติ"
        />
      );
    default:
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-error"></i>}
          color="error"
          text="ยังไม่ยืนยันตัวตน"
        />
      );
  }
};

export default function Navbar({ isCollapsed }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    user: userProfile,
    merchant,
    setMerchant,
    organization,
    setOrganization,
  } = useUserStore();
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const organizations = userProfile?.organizations || [];
  const currentUser = userProfile?.user;
  const { data: dataProfileMerchant } = useQuery({
    queryKey: ["dataProfileMerchant"],
    queryFn: async () => await getProfile(),
  });

  const merchantsLastAccessed = dataProfileMerchant?.merchants.reduce(
    (max, current) => {
      const currentTime = new Date(current.lastAccessedAt).getTime();
      const maxTime = new Date(max.lastAccessedAt).getTime();
      return currentTime > maxTime ? current : max;
    },
  );
  // Get current merchant organization
  const currentOrganization = userProfile?.organizations.find(
    (org) => org.organization.id === merchantsLastAccessed?.organizeId,
  );

  useEffect(() => {
    if (currentOrganization) {
      setOrganization({
        organizeUuid: currentOrganization.organization.uuid,
        organizationDetail: currentOrganization,
        organizeId: currentOrganization.organization.id,
      });
    }
  }, [currentOrganization]);

  const organizationMerchants = dataProfileMerchant?.merchants.filter(
    (m) => m.organizeId === organization?.organizeId,
  );

  useEffect(() => {
    if (merchantsLastAccessed) {
      setMerchant({
        merchantId: merchantsLastAccessed?.id || 0,
        merchantUuid: merchantsLastAccessed?.uuid || "",
        merchantSlug: merchantsLastAccessed?.slug || "",
      });
    }
  }, [merchantsLastAccessed]);

  const getMerchantStatus = () => {
    return { text: "เปิดขาย", color: "#00AF43" };
  };

  console.log(merchant, organization);

  // Store Selector Popover Content
  const storePopoverContent = (
    <div className="w-[250px] flex flex-col">
      <div className="pt-1 pb-3">
        <Typography variant="paragraph-small" className="!text-text-secondary">
          เลือกร้านค้า/สาขา
        </Typography>
      </div>
      {organizationMerchants?.map((m) => (
        <div
          key={m.slug}
          onClick={() => {
            setMerchant({
              merchantId: m.id,
              merchantUuid: m.uuid,
              merchantSlug: m.slug,
            });
          }}
          className={`flex gap-2 items-center justify-between rounded-md pl-1 px-3 py-2 cursor-pointer hover:bg-background-secondary/70 ${
            merchant?.merchantSlug === m.slug ? "bg-background-secondary" : ""
          }`}
        >
          <div className="flex gap-2">
            <Avatar
              size={40}
              className="!bg-primary-subtle cursor-pointer"
              icon={<i className="ri-store-2-line text-primary-dark"></i>}
            />
            <div>
              <Typography
                variant="paragraph-small"
                className="!text-primary-dark"
              >
                {m?.slug || "-"}
              </Typography>
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: getMerchantStatus().color }}
                />
                <Typography
                  variant="paragraph-extra-small"
                  className="!text-text-quarternary"
                >
                  {getMerchantStatus().text}
                </Typography>
              </div>
            </div>
          </div>
          {merchant?.merchantSlug === m.slug && (
            <i className="ri-checkbox-circle-fill text-base text-primary ml-1"></i>
          )}
        </div>
      ))}
      <div className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer">
        <div className="flex gap-2 items-center">
          <i className="ri-add-circle-line text-base"></i>
          เพิ่มสาขาใหม่
        </div>
      </div>
      <div
        className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer"
        onClick={() => router.push("/merchant-list")}
      >
        <div className="flex gap-2 items-center">
          <i className="ri-settings-3-line text-base"></i>
          จัดการร้านค้าทั้งหมด
        </div>
      </div>
    </div>
  );

  // Organization Selector Popover Content
  const organizationPopoverContent = (
    <div className="w-[280px] flex flex-col">
      <Typography
        variant="paragraph-medium"
        className="!text-text-secondary !font-medium mb-2"
      >
        เลือกองค์กร
      </Typography>
      {organizations.length > 0 && (
        <div className="px-4 py-3 rounded-2xl bg-background-secondary">
          <div className="mb-2">
            <Typography
              variant="paragraph-extra-small"
              className="!text-text-quinary"
            >
              องค์กรของคุณ
            </Typography>
          </div>
          {organizations.map((org) => (
            <div
              key={org.organization.uuid}
              onClick={() => {
                setOrganization({
                  organizeUuid: org.organization.uuid,
                  organizationDetail: org,
                  organizeId: org.organization.id,
                });
                // Set the first merchant of the selected organization (by lastAccessedAt)
                const orgMerchants = dataProfileMerchant?.merchants.filter(
                  (m) => m.organizeId === org.organization.id,
                );
                if (orgMerchants && orgMerchants.length > 0) {
                  const lastAccessedMerchant = orgMerchants.reduce(
                    (max, current) => {
                      const currentTime = new Date(
                        current.lastAccessedAt,
                      ).getTime();
                      const maxTime = new Date(max.lastAccessedAt).getTime();
                      return currentTime > maxTime ? current : max;
                    },
                  );
                  setMerchant({
                    merchantId: lastAccessedMerchant.id,
                    merchantUuid: lastAccessedMerchant.uuid,
                    merchantSlug: lastAccessedMerchant.slug,
                  });
                }
              }}
              className="cursor-pointer"
            >
              <div className="flex gap-2 items-center justify-between pl-1 px-3 py-2 hover:bg-white/50 rounded-lg">
                <div className="flex gap-2">
                  <Avatar size={40} className="!bg-[#E8F5E9]">
                    <span className="text-primary text-base font-semibold">
                      {org.organization.organizeName
                        ?.substring(0, 2)
                        .toUpperCase() || "OR"}
                    </span>
                  </Avatar>
                  <div>
                    <Typography
                      variant="paragraph-small"
                      className="!text-text-secondary"
                    >
                      {org.organization.organizeName || "-"}
                    </Typography>
                    <div className="flex items-center gap-1">
                      <Typography
                        variant="paragraph-extra-small"
                        className="!text-text-quarternary"
                      >
                        {org.isOwner ? "เจ้าของ" : "สมาชิก"}
                      </Typography>
                    </div>
                  </div>
                </div>
                {organization?.organizeId === org.organization.id && (
                  <i className="ri-checkbox-circle-fill text-base text-primary ml-1"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer">
        <div className="flex gap-2 items-center">
          <i className="ri-add-circle-line text-base"></i>
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            เพิ่มองค์กรใหม่
          </Typography>
        </div>
      </div>
      <div
        className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer"
        onClick={() => router.push("/your-organization")}
      >
        <div className="flex gap-2 items-center">
          <i className="ri-settings-3-line text-base"></i>
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            จัดการองค์กรทั้งหมด
          </Typography>
        </div>
      </div>
    </div>
  );

  // User Profile Popover Content
  const userPopoverContent = (
    <div className="w-[250px] flex flex-col">
      <div className="flex gap-2 mb-2">
        <Avatar
          size={40}
          className="!bg-primary-subtle cursor-pointer"
          icon={<i className="ri-user-line text-primary-dark"></i>}
        />
        <div>
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {currentUser?.name}
          </Typography>
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {currentUser?.email || "-"}
          </Typography>
        </div>
      </div>
      <div
        className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer hover:bg-gray-50"
        onClick={() => router.push("/account")}
      >
        <div className="flex gap-2 items-center">
          <i className="ri-user-settings-line text-base"></i>
          ข้อมูลโปรไฟล์
        </div>
        {renderLabelByStatus(currentUser?.kycStatus || "")}
      </div>
      <div
        className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer hover:bg-gray-50"
        onClick={() => router.push("/your-organization")}
      >
        <div className="flex gap-2 items-center">
          <i className="ri-settings-4-line text-base"></i>
          การจัดการองค์กร
        </div>
      </div>
      <div className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer hover:bg-gray-50">
        <div className="flex gap-2 items-center">
          <i className="ri-settings-4-line text-base"></i>
          การตั้งค่า
        </div>
      </div>
      <div className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer hover:bg-gray-50">
        <div className="flex gap-2 items-center">
          <i className="ri-global-line text-base"></i>
          ภาษาไทย (Thai)
        </div>
      </div>
      <div
        className="p-2 flex items-center justify-between text-sm text-text-secondary cursor-pointer hover:bg-gray-50"
        onClick={logout}
      >
        <div className="flex gap-2 items-center">
          <i className="ri-logout-box-line text-base"></i>
          ออกจากระบบ
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 right-0 h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between z-[999] transition-[left] duration-200`}
      style={{
        left: isCollapsed ? 80 : 290,
      }}
    >
      {/* Left Section - Store Selector */}
      <div>
        {merchant && (
          <Popover
            content={storePopoverContent}
            placement="bottomLeft"
            trigger="click"
          >
            <div className="flex gap-2 items-center bg-background-secondary rounded-full pl-1 px-3 py-1 cursor-pointer">
              <Avatar
                size={40}
                className="!bg-primary-subtle cursor-pointer"
                icon={<i className="ri-store-2-line text-primary-dark"></i>}
              />
              <div>
                <Typography
                  variant="paragraph-small"
                  className="!text-primary-dark"
                >
                  {merchant?.merchantSlug || "ร้านค้า"}
                </Typography>
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: getMerchantStatus().color }}
                  />
                  <Typography
                    variant="paragraph-extra-small"
                    className="!text-text-quarternary"
                  >
                    {getMerchantStatus().text}
                  </Typography>
                </div>
              </div>
              <i className="ri-arrow-down-s-line text-2xl text-primary ml-1"></i>
            </div>
          </Popover>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Badge
          count={2}
          style={{
            backgroundColor: "#00AF43",
            fontSize: 10,
            height: 18,
            minWidth: 18,
            lineHeight: "18px",
            padding: "0 4px",
          }}
          offset={[-3, 3]}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white">
            <i className="ri-notification-line text-lg text-[#37404F]"></i>
          </div>
        </Badge>

        {/* Organization Selector */}
        {organization?.organizationDetail && (
          <Popover
            content={organizationPopoverContent}
            placement="bottomRight"
            trigger="click"
          >
            <div className="cursor-pointer flex items-center justify-between rounded-full pl-1 pr-2 py-1 bg-background-secondary w-[280px]">
              <div className="flex gap-2 items-center">
                <Avatar size={40} className="!bg-[#E8F5E9]">
                  <span className="text-[#00AF43] text-base font-semibold">
                    {organization.organizationDetail?.organization?.organizeName
                      ?.substring(0, 2)
                      .toUpperCase() || "OR"}
                  </span>
                </Avatar>
                <div>
                  <Typography
                    variant="paragraph-extra-small"
                    className="!font-medium !text-text-secondary"
                  >
                    {organization.organizationDetail?.organization
                      ?.organizeName || "องค์กร"}
                  </Typography>
                  <div className="flex items-center gap-1">
                    <Typography
                      variant="paragraph-extra-small"
                      className="!text-text-quarternary"
                    >
                      {organization.organizationDetail?.isOwner
                        ? "เจ้าของ"
                        : "สมาชิก"}
                    </Typography>
                    {renderLabelByStatus(
                      organization.organizationDetail?.organization
                        ?.kycStatus || "",
                    )}
                  </div>
                </div>
              </div>
              <i className="ri-arrow-down-s-line text-2xl text-primary ml-1"></i>
            </div>
          </Popover>
        )}

        {/* User Profile */}
        {currentUser && (
          <Popover
            content={userPopoverContent}
            trigger="click"
            placement="bottomRight"
            open={userPopoverOpen}
            onOpenChange={setUserPopoverOpen}
          >
            <div className="aspect-square">
              <Avatar
                size={48}
                className="!bg-primary-subtle cursor-pointer"
                icon={<i className="ri-user-line text-primary-dark"></i>}
              />
            </div>
          </Popover>
        )}
      </div>
    </header>
  );
}
