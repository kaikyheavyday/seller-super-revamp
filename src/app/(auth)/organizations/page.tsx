"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Popover } from "antd";
import { getMyOrganizationList } from "@/api/organization.api";
import { useUserStore } from "@/store/user.store";
import CustomButton from "@/components/Button";
import BadgeLabel from "@/components/BadgeLabel";
import Typography from "@/components/Typography";
import { routes } from "@/app/constants/routing.constants";

const renderMembershipType = ({ isOwner }: { isOwner: boolean }) => {
  if (isOwner) {
    return (
      <div className="flex items-center gap-1">
        <i className="ri-vip-crown-fill text-warning-p20" />
        <Typography
          variant="paragraph-small-medium"
          className="text-warning-p20"
        >
          ผู้สร้างองค์กร
        </Typography>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1">
        <i className="ri-user-shared-line text-neutral-60" />
        <Typography
          variant="paragraph-small-medium"
          className="!text-neutral-60"
        >
          ผู้เข้าร่วมองค์กร
        </Typography>
      </div>
    );
  }
};

const renderLabelByStatus = (status: string) => {
  switch (status) {
    case "NONE":
      return (
        <BadgeLabel
          prefix={<i className="ri-information-line text-error"></i>}
          color="error"
          variant="ghost"
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
          rounding="pill"
          text="ยังไม่ยืนยันตัวตน"
        />
      );
  }
};

export const OrganizationPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [page, setPage] = useState(1);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const limit = 10;

  const { data: organizationData, isLoading } = useQuery({
    queryKey: ["organizations", user?.user?.uuid, page],
    queryFn: () =>
      getMyOrganizationList(user?.user?.uuid || "", { page, limit }),
    enabled: !!user?.user?.uuid,
  });

  const organizations = organizationData?.data?.organizations || [];
  const pagination = organizationData?.data?.pagination;

  const handleMenuItemClick = (org: any, action: string) => {
    setOpenPopoverId(null);

    switch (action) {
      case "info":
        // router.push('/organization/management');
        console.log("Navigate to organization info");
        break;
      case "members":
        // router.push('/organization/members');
        console.log("Navigate to members");
        break;
      case "roles":
        // router.push('/organization/roles');
        console.log("Navigate to roles");
        break;
      case "stores":
        // router.push('/organization/manage-store');
        console.log("Navigate to stores");
        break;
      case "phones":
        // router.push('/organization/phones');
        console.log("Navigate to phones");
        break;
    }
  };

  const getMenuContent = (org: any) => (
    <div className="w-[200px] flex flex-col">
      <button
        type="button"
        onClick={() => handleMenuItemClick(org, "info")}
        className="px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Typography variant="paragraph-small" className="!text-neutral-60">
          ข้อมูลองค์กร
        </Typography>
      </button>
      <button
        type="button"
        onClick={() => handleMenuItemClick(org, "members")}
        className="px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Typography variant="paragraph-small" className="!text-neutral-60">
          สมาชิก
        </Typography>
      </button>
      <button
        type="button"
        onClick={() => handleMenuItemClick(org, "roles")}
        className="px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Typography variant="paragraph-small" className="!text-neutral-60">
          บทบาทและสิทธิ์
        </Typography>
      </button>
      <button
        type="button"
        onClick={() => handleMenuItemClick(org, "stores")}
        className="px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Typography variant="paragraph-small" className="!text-neutral-60">
          ข้อมูลร้านค้า
        </Typography>
      </button>
      <button
        type="button"
        onClick={() => handleMenuItemClick(org, "phones")}
        className="px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Typography variant="paragraph-small" className="text-neutral-60">
          เบอร์โทรในนามองค์กร
        </Typography>
      </button>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <CustomButton
            variant="link"
            className="!px-0"
            icon={<i className="ri-arrow-left-line" />}
            color="neutral"
            onClick={() => router.push(routes.home())}
          >
            ย้อนกลับ
          </CustomButton>
          <Typography variant="h3">องค์กรของคุณ</Typography>
          <Typography variant="paragraph-small">
            จัดการข้อมูลองค์กรที่คุณเป็นสมาชิกหรือเป็นผู้สร้าง
            และตรวจสอบสิทธิ์การเข้าถึง
          </Typography>
        </div>
        <CustomButton
          variant="solid"
          color="primary"
          onClick={() => {
            // Navigate to create organization page (you'll need to add this route)
            // router.push('/your-organization/new');
          }}
        >
          สร้างองค์กรใหม่
        </CustomButton>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Typography variant="paragraph-medium" className="text-gray-600">
            กำลังโหลด...
          </Typography>
        </div>
      ) : (
        <>
          <div className="space-y-7">
            <table
              className="w-full border-separate"
              style={{ borderSpacing: "0 28px" }}
            >
              <thead>
                <tr className="bg-transparent">
                  <th className="px-6 py-4 text-left bg-transparent border-none">
                    <Typography
                      variant="paragraph-medium"
                      className="!text-text-quinary !font-normal"
                    >
                      ชื่อองค์กร
                    </Typography>
                  </th>
                  <th className="px-6 py-4 text-left bg-transparent border-none">
                    <Typography
                      variant="paragraph-medium"
                      className="!text-text-quinary !font-normal"
                    >
                      บทบาท
                    </Typography>
                  </th>
                  <th className="px-6 py-4 text-left bg-transparent border-none">
                    <Typography
                      variant="paragraph-medium"
                      className="!text-text-quinary !font-normal"
                    >
                      ประเภทการเป็นสมาชิก
                    </Typography>
                  </th>
                  <th className="px-6 py-4 text-left bg-transparent border-none">
                    <Typography
                      variant="paragraph-medium"
                      className="!text-text-quinary !font-normal"
                    >
                      จำนวนสมาชิก (ผู้ใช้)
                    </Typography>
                  </th>
                  <th className="px-6 py-4 text-left bg-transparent border-none">
                    <Typography
                      variant="paragraph-medium"
                      className="!text-text-quinary !font-normal"
                    >
                      สถานะยืนยันตัวตนขององค์กร
                    </Typography>
                  </th>
                  <th className="px-6 py-4 bg-transparent border-none"></th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org: any, index: number) => (
                  <tr
                    key={index}
                    className="bg-white shadow-sm rounded-[30px]"
                    style={{
                      boxShadow: "0px 1px 3px 0px rgba(36, 42, 52, 0.1)",
                    }}
                  >
                    <td className="px-6 py-3 rounded-l-[30px] border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-[10px] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {org.organization.logo ? (
                            <img
                              src={org.organization.logo}
                              alt={org.organization.organizeName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <i className="ri-group-line !text-text-quinary text-2xl"></i>
                          )}
                        </div>
                        <Typography
                          variant="paragraph-medium"
                          className="text-neutral-40"
                        >
                          {org.organization.organizeName}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-6 py-3 border-none">
                      <Typography
                        variant="paragraph-medium"
                        className="text-neutral-40"
                      >
                        {org.role.displayName}
                      </Typography>
                    </td>
                    <td className="px-6 py-3 border-none">
                      {renderMembershipType({ isOwner: org.isOwner })}
                    </td>
                    <td className="px-6 py-3 border-none">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-neutral-p95 flex items-center justify-center">
                          <i className="ri-group-line !text-text-quinary"></i>
                        </div>
                        <Typography
                          variant="paragraph-medium"
                          className="!text-neutral-40"
                        >
                          {org.organization.totalUsers}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-6 py-3 border-none">
                      {renderLabelByStatus(org.organization.kycStatus)}
                    </td>
                    <td className="px-6 py-3 rounded-r-[30px] border-none">
                      <Popover
                        content={getMenuContent(org)}
                        trigger="click"
                        placement="bottomRight"
                        open={openPopoverId === org.organization.id}
                        onOpenChange={(open) => {
                          setOpenPopoverId(open ? org.organization.id : null);
                        }}
                        classNames={{
                          body: "!px-2 !py-[2px]",
                        }}
                      >
                        <div>
                          <CustomButton
                            htmlType="button"
                            variant="outlined"
                            color="neutral"
                            icon={<i className="ri-more-2-fill" />}
                          />
                        </div>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Typography variant="paragraph-small">ก่อนหน้า</Typography>
              </button>
              <Typography variant="paragraph-small" className="text-gray-600">
                หน้า {pagination.page} จาก {pagination.totalPages}
              </Typography>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Typography variant="paragraph-small">ถัดไป</Typography>
              </button>
            </div>
          )}

          {pagination && (
            <div className="mt-6">
              <Typography
                variant="paragraph-small"
                className="text-text-secondary"
              >
                ทั้งหมด {pagination.totalOrganizations} รายการ
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizationPage;
