import React from "react";
import { Form, Radio } from "antd";
import { Rule } from "antd/es/form";
import { RadioGroupProps } from "antd/es/radio";
import { FormItemProps } from "antd/es/form";
import "./custom.css";
import { useDataTestIdWithPath } from "@/utils/DataTestId/data-test-id.utils";
import { usePathname } from "next/navigation";

interface RadioOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface RadioGroupComponentProps extends Omit<RadioGroupProps, "options"> {
  dataTestId?: string;
  name?: any;
  label?: React.ReactNode;
  rules?: any[];
  options: RadioOption[];
  useRadioButton?: boolean;
  formItemProps?: Omit<FormItemProps, 'name' | 'label' | 'rules'>;
  radioGroupProps?: Omit<
    RadioGroupProps,
    'onChange' | 'value' | 'buttonStyle' | 'options'
  >;
  block?: boolean;
  disabled?: boolean;
  vertical?: boolean;
  validateStatus?:
    | ''
    | 'warning'
    | 'error'
    | 'success'
    | 'validating'
    | undefined;
  help?: string;
}

const RadioGroup: React.FC<RadioGroupComponentProps> = ({
  dataTestId,
  name,
  label,
  rules,
  options = [],
  onChange,
  value,
  buttonStyle,
  useRadioButton = false,
  formItemProps = {},
  radioGroupProps = {},
  block = false,
  vertical = false,
  disabled = false,
  validateStatus,
  help,
}) => {
  const useDataTestId = useDataTestIdWithPath(usePathname(), 'radio', name, dataTestId);

  const radioGroup = (
    <Radio.Group
      data-testid={useDataTestId}
      size="large"
      onChange={onChange}
      value={value}
      buttonStyle={buttonStyle}
      block={block}
      disabled={disabled}
      className="custom-allkons custom-radio-group"
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        gap: '12px',
      }}
      {...radioGroupProps}
    >
      {
      options.map((option) => {
        return useRadioButton ? (
          <Radio.Button
            data-testid={`${useDataTestId}-${option.value.toString().toLowerCase()}`}
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Radio.Button>
        ) : (
          <Radio
            data-testid={`${useDataTestId}-${option.value.toString().toLowerCase()}`}
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Radio>
        )
      })}
    </Radio.Group>
  );

  const isRequired =
    Array.isArray(rules) && rules.some((rule) => rule.required === true);

  const renderLabel = () => {
    if (label) {
      return (
        <span>
          {label}
          {isRequired && <span className="text-error ml-1 text-xs">*</span>}
        </span>
      );
    }
    return null;
  };

  if (name || label || rules || Object.keys(formItemProps).length > 0) {
    const labelCol = vertical ? { span: 24 } : undefined;
    const wrapperCol = vertical ? { span: 24 } : undefined;
    return (
      <Form.Item
        name={name}
        label={renderLabel()}
        rules={rules}
        required={false}
        colon={false}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        layout="vertical"
        validateStatus={validateStatus}
        help={help}
        className="!mb-0"
        {...formItemProps}
      >
        {radioGroup}
      </Form.Item>
    );
  }

  return radioGroup;
};

export default RadioGroup;

// Example 1: Basic usage with Form.Item properties
/* 
<RadioGroup 
  name="gender"
  label="Gender"
  rules={[{ required: true, message: 'Please select gender' }]}
  options={[
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]}
/>
*/

// Example 2: Using Radio.Button style
/*
<RadioGroup 
  name="size"
  label="Size"
  useRadioButton={true}
  buttonStyle="solid"
  options={[
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ]}
/>
*/

// Example 3: Using without Form.Item (standalone)
/*
<RadioGroup 
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]}
  value="a"
/>
*/

// Example 4: With additional Form.Item props and Radio.Group props
/*
<RadioGroup 
  name="payment"
  label="Payment Method"
  formItemProps={{
    tooltip: 'Select your preferred payment method',
    extra: 'We will use this for billing',
  }}
  radioGroupProps={{
    disabled: false,
    optionType: 'default',
  }}
  options={[
    { label: 'Credit Card', value: 'credit' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank' },
  ]}
/>
*/
