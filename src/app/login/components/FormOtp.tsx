"use client";

import { Form, FormInstance, Input, Spin } from "antd";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDataTestIdWithPath } from "@/utils/DataTestId/data-test-id.utils";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import { useForm } from "antd/es/form/Form";
import SectionIcon from "@/components/Section/SectionIcon";
import { ISendOtpToPhoneNumberResponse } from "@/api/auth.api";

interface FormOtpProps {
  loading?: boolean;
  onFinish?: (values: { otp: string }) => Promise<void>;
  otpData?: ISendOtpToPhoneNumberResponse;
  resendOtp?: () => void;
  testId?: string;
}

const FormOtp: React.FC<FormOtpProps> = ({
  onFinish: onFinishProp,
  loading,
  otpData,
  resendOtp,
  testId,
}) => {
  const [countdown, setCountdown] = useState(0);
  const [disabledButton, setDisabledButton] = useState(true);
  const [otpForm] = useForm<{ otp: string }>();

  useEffect(() => {
    if (otpData) {
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpData]);

  const onFinish = async (values: { otp: string }) => {
    if (onFinishProp) {
      await onFinishProp(values);
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabledButton && !loading) {
      e.preventDefault();
      otpForm.submit();
    }
  };

  const useDataTestId = useDataTestIdWithPath(
    usePathname(),
    "otp-input",
    "test"
  );

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-start w-[400px]">
        <SectionIcon
          iconClass="ri-lock-password-fill"
          type="success"
          loading={loading}
        />
        <Form
          form={otpForm}
          onFinish={onFinish}
          layout="vertical"
          clearOnDestroy
        >
          <div className="mt-6 text-center">
            <Typography variant="h5" className="!text-text-secondary">
              กรุณากรอกรหัสยืนยัน (OTP)
            </Typography>
            <Typography
              variant="paragraph-medium"
              className="!text-text-quinary"
            >
              รหัสอ้างอิง {otpData?.refno}
            </Typography>
          </div>
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Please input your OTP!" },
              {
                pattern: /^\d{6}$/,
                message: "OTP must be a 6-digit number!",
              },
            ]}
            className="text-center !mt-6"
          >
            <Input.OTP
              size="large"
              className="text-center"
              type="tel"
              data-testid={testId ? testId : useDataTestId}
              style={{ flex: "none" }}
              onInput={(e) => {
                const filteredInput = e.filter((char) => char !== "");
                if (filteredInput.length === 6) {
                  setDisabledButton(false);
                } else {
                  setDisabledButton(true);
                }
              }}
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onKeyDown={handleKeyDown}
            />
          </Form.Item>
          <div
            className={`text-center ${
              otpForm.getFieldError("otp").length ? "mt-12" : "mt-6"
            }`}
          >
            {countdown > 0 ? (
              <>
                <Typography
                  variant="paragraph-small"
                  className="!text-text-quinary"
                >
                  OTP ใหม่ถูกส่งไปยังเบอร์ของคุณแล้ว
                </Typography>
                <Typography
                  variant="paragraph-small"
                  className="!text-text-quinary"
                >
                  ขอรหัสใหม่ในอีก{" "}
                  <span className="text-primary font-semibold">
                    ({countdown} วินาที)
                  </span>
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  variant="paragraph-small"
                  className="!text-text-quinary"
                >
                  หากยังไม่ได้รับรหัสยืนยัน (OTP) กรุณากดขอรหัสใหม่
                </Typography>
                <Button
                  variant="link"
                  onClick={() => {
                    if (resendOtp) {
                      resendOtp();
                    }
                  }}
                  size="small"
                >
                  ขอรหัสใหม่
                </Button>
              </>
            )}
          </div>

          <Form.Item shouldUpdate className="!mt-6">
            {({ getFieldValue }) => {
              const otpValue = getFieldValue("otp");
              const isOtpValid = /^\d{6}$/.test(otpValue);
              const disabledButton = !isOtpValid || loading;
              return (
                <Button
                  htmlType="submit"
                  fullWidth
                  loading={loading}
                  disabled={disabledButton}
                >
                  ยืนยัน
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormOtp;
