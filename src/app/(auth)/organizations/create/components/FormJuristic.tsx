import { getOrganizationJuristicTypeMasterData } from "@/api/organization.api";
import { organizationBusinessTypeOptions } from "@/app/constants/organization.constants";
import Button from "@/components/Button";
import Select from "@/components/DataEntry/Select";
import TextField from "@/components/DataEntry/TextField";
import Typography from "@/components/Typography";
import { useQuery } from "@tanstack/react-query";
import { Checkbox, Form } from "antd";
const CheckboxGroup = Checkbox.Group;

const FormJuristic = () => {
  const { data: juristicOrgs } = useQuery({
    queryKey: ["juristic-type-master-data"],
    queryFn: getOrganizationJuristicTypeMasterData,
  });
  const juristicTypeOptions =
    juristicOrgs?.data
      ?.map((item) => ({
        label: item.label,
        value: item.value,
      }))
      .reverse()
      .filter((item) => item.value !== "PERSONAL") || [];

  return (
    <Form layout="vertical">
      <div className="flex flex-col gap-4">
        <Form.Item
          name="businessType"
          className="!mb-0"
          label={
            <Typography
              variant="paragraph-small"
              className="!text-text-secondary !font-medium"
            >
              ประเภทธุรกิจ <span className="text-primary text-xs">*</span>
            </Typography>
          }
          rules={[
            {
              required: true,
              message: "กรุณาเลือกประเภทธุรกิจ",
            },
          ]}
        >
          <CheckboxGroup
            options={organizationBusinessTypeOptions}
            value={[""]}
            className="flex flex-col gap-2"
          />
        </Form.Item>
        <div className="flex items-center gap-2">
          <div className="w-full">
            <TextField
              name="taxId"
              label={"เลขประจำตัวนิติบุคคล"}
              placeholder={"กรุณากรอกเเลขประจำตัวนิติบุคคล"}
              // onChange={handleChangeRegistrationNumber}
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเเลขประจำตัวนิติบุคคล",
                },
              ]}
              maxLength={13}
              // className={`${
              //   isSuccessCheckRegistrationNumber &&
              //   !setUserForm.getFieldError("registrationNumber").length
              //     ? "border !border-primary"
              //     : ""
              // } `}
              suffix={
                <>
                  {/* {setUserForm.getFieldError("registrationNumber")[0] ===
                  "เลขทะเบียนพาณิชย์ถูกใช้สมัครแล้ว" && (
                  <i className="ri-information-line text-error"></i>
                )}
                {isSuccessCheckRegistrationNumber &&
                  !setUserForm.getFieldError("registrationNumber").length && (
                    <i className="ri-check-line text-primary"></i>
                  )} */}
                </>
              }
              // validateStatus={
              //   setUserForm.getFieldError("registrationNumber").length > 0
              //     ? "error"
              //     : isSuccessCheckRegistrationNumber
              //       ? "success"
              //       : ""
              // }
              // help={
              //   setUserForm.getFieldError("registrationNumber").length > 0
              //     ? setUserForm.getFieldError("registrationNumber")[0]
              //     : isSuccessCheckRegistrationNumber
              //       ? "สามารถใช้เลขทะเบียนพาณิชย์ได้"
              //       : "กดปุ่มตรวจสอบเพื่อยืนยันเลขทะเบียนพาณิชย์"
              // }
            />
          </div>
          <div className="mt-2">
            <Button>ตรวจสอบ</Button>
          </div>
        </div>
        <Select
          name="juristicType"
          label="ประเภทนิติบุคคล"
          options={juristicTypeOptions}
          placeholder="กรุณาเลือกประเภทนิติบุคคล"
          getPopupContainer={(triggerNode) =>
            triggerNode.parentElement || document.body
          }
          rules={[
            {
              required: true,
              message: "กรุณาเลือกประเภทนิติบุคคล",
            },
          ]}
          onChange={(value) => {
            // const juristicTypeId = juristicTypeList.find(
            //   (juristic: any) => juristic.value === value,
            // )?.id;
            // setUserForm.setFieldsValue({
            //   juristicTypeId: juristicTypeId,
            // });
          }}
        />
        <TextField
          name="juristicName"
          label="ชื่อองค์กร"
          placeholder="กรุณากรอกชื่อองค์กร"
          addonBefore={""}
          addonAfter={""}
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อองค์กร",
            },
            {
              pattern: /^[a-zA-Zก-๙0-9\s]+$/,
              message: "ไม่อนุญาตให้กรอกอักขระพิเศษ",
            },
            {
              max: 50,
              message: "ข้อมูลที่กรอกมีความยาวเกินกว่ากำหนด (50 ตัวอักษร)",
            },
            {
              validator: (_: unknown, value: string) => {
                if (value && value.trim() === "") {
                  return Promise.reject("กรุณากรอกชื่อองค์กร");
                }
                return Promise.resolve();
              },
            },
          ]}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.startsWith(" ")) {
              target.value = target.value.trimStart();
            }
          }}
        />
        <TextField
          name="branchName"
          label="ชื่อสาขา"
          placeholder="กรุณากรอกชื่อสาขา"
          //   disabled={}
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อสาขา",
            },
            {
              max: 100,
              message: "ข้อมูลที่กรอกมีความยาวเกินกว่ากำหนด (100 ตัวอักษร)",
            },
          ]}
        />
      </div>
    </Form>
  );
};

export default FormJuristic;
