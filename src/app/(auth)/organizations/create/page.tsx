"use client";

import { OrganizationType } from "@/app/constants/enum/organization.enum";
import { routes } from "@/app/constants/routing.constants";
import CustomButton from "@/components/Button";
import CardSelection from "@/components/Card";
import Typography from "@/components/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormRegisteredIndividual from "./components/FormRegisteredIndividual";
import FormJuristic from "./components/FormJuristic";

const OrganizationCreatePage = () => {
  const router = useRouter();
  const [orgType, setOrgType] = useState<OrganizationType>(
    OrganizationType.REGISTERED_INDIVIDUAL,
  );
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <CustomButton
            variant="link"
            className="!px-0"
            icon={<i className="ri-arrow-left-line" />}
            color="neutral"
            onClick={() => router.push(routes.organizationList())}
          >
            ย้อนกลับ
          </CustomButton>
          <Typography variant="h3">สร้างองค์กรใหม่</Typography>
          <Typography variant="paragraph-small">
            กรอกข้อมูลเพื่อสร้างองค์กรใหม่ของคุณ
          </Typography>
        </div>
        <CustomButton
          variant="solid"
          color="primary"
          onClick={() => {
            router.push(routes.organizationCreate());
          }}
        >
          สร้างองค์กรใหม่
        </CustomButton>
      </div>
      <div className="bg-white p-6 mt-6 flex flex-col gap-2 rounded-2xl">
        <Typography variant="paragraph-medium" className="text-text-secondary">
          คุณต้องการสร้างองค์กร และเปิดร้านบน Allkons ในนาม?
        </Typography>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <CardSelection
            isSelected={orgType === OrganizationType.REGISTERED_INDIVIDUAL}
            icon="ri-file-list-3-line"
            label="บุคคลธรรมดาที่จดทะเบียนพาณิชย์"
            onClick={() => setOrgType(OrganizationType.REGISTERED_INDIVIDUAL)}
          />
          <CardSelection
            isSelected={orgType === OrganizationType.JURISTIC}
            icon="ri-briefcase-2-line"
            label="นิติบุคคล"
            onClick={() => setOrgType(OrganizationType.JURISTIC)}
          />
        </div>
        {orgType === OrganizationType.REGISTERED_INDIVIDUAL ? (
          <FormRegisteredIndividual />
        ) : (
          <FormJuristic />
        )}
      </div>
    </div>
  );
};

export default OrganizationCreatePage;
