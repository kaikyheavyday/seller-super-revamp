import { organizationBusinessTypeOptions } from "@/app/constants/organization.constants";
import Button from "@/components/Button";
import TextField from "@/components/DataEntry/TextField";
import Typography from "@/components/Typography";
import { Checkbox, Form } from "antd";

const CheckboxGroup = Checkbox.Group;

const FormRegisteredIndividual = () => {
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
              name="registrationNumber"
              label={"เลขทะเบียนพาณิชย์"}
              placeholder={"กรุณากรอกเลขทะเบียนพาณิชย์"}
              // onChange={handleChangeRegistrationNumber}
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเลขทะเบียนพาณิชย์",
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
        <TextField
          name="idCard"
          label={"เลขประจำตัวประชาชน"}
          placeholder={"กรุณากรอกเลขประจำตัวประชาชน"}
          onChange={() => {}}
          rules={[
            {
              required: true,
              message: "กรุณากรอกเลขประจำตัวประชาชน",
            },
          ]}
          maxLength={13}
        />
        <TextField
          name="registrationName"
          label="ชื่อที่ใช้ในการประกอบพาณิชยกิจ"
          placeholder="กรอกชื่อร้าน"
          addonBefore="ร้าน"
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อที่ใช้ในการประกอบพาณิชยกิจ",
            },
          ]}
        />
      </div>
    </Form>
  );
};

export default FormRegisteredIndividual;
