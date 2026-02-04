"use client";
import { Popover, Badge, Avatar } from "antd";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Typography from "@/components/Typography";
import BadgeLabel from "@/components/BadgeLabel";
import { useUserStore } from "@/store/user.store";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/auth.api";
import Image from "next/image";
import { routes } from "@/app/constants/routing.constants";
import { OrganizationType } from "@/app/constants/enum/organization.enum";
import CustomButton from "../Button";

interface NavbarProps {
  isCollapsed: boolean;
}

const renderLabelByStatus = (status: string) => {
  switch (status) {
    case "NONE":
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-error"></i>}
          color="error"
          variant="ghost"
          size="small"
          rounding="pill"
          text="ยังไม่ยืนยันตัวตน"
        />
      );
    case "WAIT_FOR_APPROVE":
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-warning"></i>}
          color="warning"
          variant="ghost"
          size="small"
          rounding="pill"
          text="รอการอนุมัติ"
        />
      );
    case "REQUEST_MORE":
      return (
        <BadgeLabel
          prefix={<i className="ri-draft-line text-info"></i>}
          color="info"
          variant="ghost"
          size="small"
          rounding="pill"
          text="ขอข้อมูลเพิ่มเติม"
        />
      );
    case "APPROVE":
      return (
        <BadgeLabel
          prefix={<i className="ri-verified-badge-line text-success"></i>}
          color="success"
          variant="ghost"
          size="small"
          rounding="pill"
          text="ยืนยันตัวตนแล้ว"
        />
      );
    case "REJECT":
      return (
        <BadgeLabel
          prefix={<i className="ri-close-line text-error"></i>}
          color="error"
          variant="ghost"
          size="small"
          rounding="pill"
          text="ไม่ได้รับการอนุมัติ"
        />
      );
    default:
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-error"></i>}
          color="error"
          variant="ghost"
          size="small"
          rounding="pill"
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
  const pathname = usePathname();
  const isOrganizationMode = useMemo(() => {
    return pathname.startsWith("/organizations");
  }, [pathname]);
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
  const currentOrganization = organization
    ? organization?.organizationDetail
    : userProfile?.organizations.find(
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
    if (organizationMerchants && organizationMerchants.length === 1) {
      setMerchant({
        merchantId: organizationMerchants[0].id,
        merchantUuid: organizationMerchants[0].uuid,
        merchantSlug: organizationMerchants[0].slug,
        merchantName: organizationMerchants[0].companyName,
      });
    }
  }, [organizationMerchants]);

  const registeredIndividualOrgs = organizations.filter(
    (org) =>
      org.organization.organizationType ===
      OrganizationType.REGISTERED_INDIVIDUAL,
  );
  const juristicOrgs = organizations.filter(
    (org) => org.organization.organizationType === OrganizationType.JURISTIC,
  );
  console.log(registeredIndividualOrgs, juristicOrgs);

  const getMerchantStatus = () => {
    return { text: "เปิดขาย", color: "#00AF43" };
  };

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
              merchantName: m.companyName,
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
                {m?.companyName || "-"}
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
        onClick={() => router.push(routes.merchantList())}
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
      {(juristicOrgs.length > 0 || registeredIndividualOrgs.length > 0) && (
        <div className="flex flex-col gap-2">
          {juristicOrgs.length > 0 && (
            <div className="px-4 py-3 rounded-2xl bg-background-secondary">
              <div className="mb-2">
                <Typography
                  variant="paragraph-extra-small"
                  className="!text-text-quinary"
                >
                  นิติบุคคล
                </Typography>
              </div>
              {juristicOrgs.map((org) => (
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
                          const maxTime = new Date(
                            max.lastAccessedAt,
                          ).getTime();
                          return currentTime > maxTime ? current : max;
                        },
                      );
                      setMerchant({
                        merchantId: lastAccessedMerchant.id,
                        merchantUuid: lastAccessedMerchant.uuid,
                        merchantSlug: lastAccessedMerchant.slug,
                        merchantName: lastAccessedMerchant.companyName,
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
                    {organization?.organizeId === org.organization.id ? (
                      <i className="ri-checkbox-circle-fill text-base text-primary ml-1"></i>
                    ) : (
                      <i className="ri-checkbox-blank-circle-line text-[#BDC3CD] ml-1"></i>
                    )}
                  </div>
                  {organization?.organizeId === org.organization.id && (
                    <div className="w-full my-2">
                      <CustomButton
                        size="small"
                        variant="outlined"
                        color="neutral"
                        fullWidth
                        icon={<i className="ri-edit-2-line" />}
                      >
                        แก้ไขข้อมูลองค์กร
                      </CustomButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {registeredIndividualOrgs.length > 0 && (
            <div className="px-4 py-3 rounded-2xl bg-background-secondary">
              <div className="mb-2">
                <Typography
                  variant="paragraph-extra-small"
                  className="!text-text-quinary"
                >
                  บุคคลธรรมดา จดทะเบียนพาณิชย์
                </Typography>
              </div>
              {registeredIndividualOrgs.map((org) => (
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
                          const maxTime = new Date(
                            max.lastAccessedAt,
                          ).getTime();
                          return currentTime > maxTime ? current : max;
                        },
                      );
                      setMerchant({
                        merchantId: lastAccessedMerchant.id,
                        merchantUuid: lastAccessedMerchant.uuid,
                        merchantSlug: lastAccessedMerchant.slug,
                        merchantName: lastAccessedMerchant.companyName,
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
                    {organization?.organizeId === org.organization.id ? (
                      <i className="ri-checkbox-circle-fill text-base text-primary ml-1"></i>
                    ) : (
                      <i className="ri-checkbox-blank-circle-line text-[#BDC3CD] ml-1"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
        onClick={() => router.push(routes.organizationList())}
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
        onClick={() => router.push(routes.organizationList())}
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
        left: isCollapsed ? (isOrganizationMode ? 0 : 80) : 290,
        // left: 0
      }}
    >
      {/* Left Section - Store Selector */}
      <div>
        {merchant && !isOrganizationMode && (
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
                  {merchant?.merchantName || "ร้านค้า"}
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
        {isOrganizationMode && (
          <div className="relative w-[190px] h-8">
            <Image
              src="/home/allkons-logo.svg"
              alt="Logo"
              fill
              className="object-contain cursor-pointer"
              priority
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
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
        {organization?.organizationDetail && !isOrganizationMode && (
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
