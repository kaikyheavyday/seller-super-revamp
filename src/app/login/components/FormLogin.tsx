"use client";

import Button from "@/components/Button";
import RadioGroup from "@/components/DataEntry/RadioGroup";
import TextField from "@/components/DataEntry/TextField";
import Typography from "@/components/Typography";
import { Form } from "antd";
import { useState } from "react";

interface IPhoneLoginForm {
  phoneNumber: string;
}

interface IEmailLoginForm {
  email: string;
  password: string;
}

const FormLogin = () => {
  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const [phoneLoginForm] = Form.useForm<IPhoneLoginForm>();
  const [emailLoginForm] = Form.useForm<IEmailLoginForm>();
  const handleSubmitPhoneLogin = (values: IPhoneLoginForm) => {
    console.log("Phone Login Values:", values);
  };
  const handleSubmitEmailLogin = (values: IEmailLoginForm) => {
    console.log("Email Login Values:", values);
  };
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-start w-[400px]">
        <div className="mb-4">
          <Typography variant="paragraph-small" className="!text-text-quinary">
            ยินดีต้อนรับสู่ Allkons Seller Center
          </Typography>
          <Typography variant="h3" className="!text-text-secondary">
            เข้าสู่ระบบเพื่อใช้งาน
          </Typography>
        </div>
        <div className="flex w-full my-6">
          <RadioGroup
            value={loginType}
            options={[
              {
                label: "หมายเลขโทรศัพท์",
                value: "phone",
              },
              {
                label: "ชื่อผู้ใช้",
                value: "email",
              },
            ]}
            onChange={(e) => {
              setLoginType(e.target.value);
            }}
            useRadioButton={true}
            buttonStyle="solid"
            block
          />
        </div>
        {loginType === "phone" ? (
          <Form
            form={phoneLoginForm}
            layout="vertical"
            onFinish={handleSubmitPhoneLogin}
          >
            <TextField
              name="phoneNumber"
              type="tel"
              maxLength={10}
              label="หมายเลขโทรศัพท์"
              placeholder="กรอกหมายเลขโทรศัพท์"
              rules={[
                { required: true, message: "กรุณากรอกหมายเลขโทรศัพท์" },
                {
                  pattern: /^0[689]\d{8}$/,
                  message: "กรุณากรอกเบอร์มือถือที่ถูกต้อง",
                },
              ]}
              required
            />
            <div className="flex gap-2 mt-4 items-center">
              <Typography variant="paragraph-small">
                หากท่านยังไม่เป็นสมาชิก เราแนะนำให้ท่าน
              </Typography>
              <Button
                variant="link"
                size="small"
                color="primary"
                className="p-0"
              >
                สมัครบัญชี
              </Button>
            </div>

            <div className="mt-6">
              <Button htmlType="submit" fullWidth>
                เข้าสู่ระบบ
              </Button>
            </div>
          </Form>
        ) : (
          <Form
            form={emailLoginForm}
            layout="vertical"
            className="flex flex-col gap-2"
            onFinish={handleSubmitEmailLogin}
          >
            <TextField
              name="email"
              type="email"
              label="อีเมล"
              placeholder="กรอกอีเมล"
              rules={[
                { required: true, message: "กรุณากรอกอีเมล" },
                {
                  type: "email",
                  message: "กรุณากรอกอีเมลที่ถูกต้อง",
                },
              ]}
              required
            />
            <TextField
              name="password"
              type="password"
              label="รหัสผ่าน"
              placeholder="กรอกรหัสผ่าน"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
              required
            />
            <div>
              <Button
                variant="link"
                size="small"
                color="primary"
                className="p-0"
              >
                ลืมรหัสผ่าน
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <Typography variant="paragraph-small">
                หากท่านยังไม่เป็นสมาชิก เราแนะนำให้ท่าน
              </Typography>
              <Button
                variant="link"
                size="small"
                color="primary"
                className="p-0"
              >
                สมัครบัญชี
              </Button>
            </div>
            <div className="mt-4">
              <Button htmlType="submit" fullWidth>
                เข้าสู่ระบบ
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default FormLogin;
