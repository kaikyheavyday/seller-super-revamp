"use client";

import { getProfile } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import Typography from "@/components/Typography";
import { Card } from "antd";

export default function MerchantListPage() {
  const { merchant: activeMerchant, setMerchant } = useUserStore();

  const { data: userProfile, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => await getProfile(),
  });

  const merchants = userProfile?.merchants || [];

  const handleSelectMerchant = (merchantData: {
    id: number;
    uuid: string;
    slug: string;
  }) => {
    setMerchant({
      merchantId: merchantData.id,
      merchantUuid: merchantData.uuid,
      merchantSlug: merchantData.slug,
    });

    // Refetch to update data with new merchant context
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Typography variant="h4" className="mb-2">
          เลือกร้านค้า
        </Typography>
        <Typography
          variant="paragraph-middle-regular"
          className="text-gray-500"
        >
          เลือกร้านค้าที่คุณต้องการจัดการ
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {merchants.map((merchant: any) => {
          const isActive = activeMerchant?.merchantUuid === merchant.uuid;

          return (
            <Card
              key={merchant.uuid}
              hoverable
              onClick={() =>
                handleSelectMerchant({
                  id: merchant.id,
                  uuid: merchant.uuid,
                  slug: merchant.slug,
                })
              }
              className={`cursor-pointer transition-all ${
                isActive
                  ? "border-2 border-green-500 bg-green-50"
                  : "border border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Merchant Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    isActive ? "bg-green-500" : "bg-orange-500"
                  }`}
                >
                  {merchant.name?.charAt(0).toUpperCase() || "M"}
                </div>

                {/* Merchant Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography
                      variant="paragraph-middle-medium"
                      className="text-gray-900"
                    >
                      {merchant.slug || "-"}
                    </Typography>
                    {isActive && (
                      <i className="ri-checkbox-circle-fill text-green-600"></i>
                    )}
                  </div>

                  <Typography
                    variant="paragraph-small-regular"
                    className="text-gray-500 mb-2"
                  >
                    ID: {merchant.id}
                  </Typography>
                </div>
              </div>

              {/* Additional Info */}
              {merchant.status && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Typography
                    variant="paragraph-extra-small-regular"
                    className="text-gray-500"
                  >
                    สถานะ:{" "}
                    <span className="text-green-600">{merchant.status}</span>
                  </Typography>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {merchants.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-store-line text-6xl text-gray-300 mb-4"></i>
          <Typography
            variant="paragraph-middle-regular"
            className="text-gray-500"
          >
            ไม่พบข้อมูลร้านค้า
          </Typography>
        </div>
      )}
    </div>
  );
}
