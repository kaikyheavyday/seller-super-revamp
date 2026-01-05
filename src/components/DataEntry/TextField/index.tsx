'use client';

import { Form, Input, InputProps } from 'antd';
import { FC, useState } from 'react';
import './custom.css';
import { usePathname } from "next/navigation";
import { useDataTestIdWithPath } from '@/utils/DataTestId/data-test-id.utils';

export interface TextFieldProps extends Omit<InputProps, 'size'> {
  dataTestId?: string;
  size?: 'small' | 'middle' | 'large';
  name?: any;
  label?: React.ReactNode;
  rules?: any[];
  vertical?: boolean;
  formItemProps?: Omit<
    React.ComponentProps<typeof Form.Item>,
    | 'name'
    | 'label'
    | 'rules'
    | 'labelCol'
    | 'wrapperCol'
    | 'required'
    | 'labelAlign'
    | 'labelWrap'
  >;
  validateStatus?:
    | ''
    | 'warning'
    | 'error'
    | 'success'
    | 'validating'
    | undefined;
  help?: string;
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined';
  focusRing?: boolean;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'textOnly'
    | 'textWithSymbols'
    | 'numberOnly'
    | 'tel';
  getValueProps?: (value: any) => { value: any };
}
const TextField: FC<TextFieldProps> = ({
  dataTestId,
  size = 'middle',
  placeholder = '',
  prefix,
  suffix,
  disabled = false,
  allowClear = false,
  className = '',
  name,
  label,
  rules,
  vertical = false,
  formItemProps,
  validateStatus,
  help,
  variant,
  required,
  type,
  focusRing = false,
  addonBefore,
  addonAfter,
  getValueProps,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine input size classes
  let sizeClass = '';
  if (size === 'large') {
    sizeClass = `h-[48px] ${
      addonBefore || addonAfter ? '' : '!py-3 !px-4'
    }  !text-base`;
  } else if (size === 'middle') {
    sizeClass = `h-[40px] ${
      addonBefore || addonAfter ? '' : '!py-2 !px-4'
    } !text-base`;
  } else if (size === 'small') {
    sizeClass = `h-[32px] ${
      addonBefore || addonAfter ? '' : '!py-1 !px-3'
    }  !text-sm`;
  }

  // Prepare prefix wrapper with Tailwind margin
  const defaultPrefix = prefix ? (
    <span className="mr-1">{prefix}</span>
  ) : undefined;

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle input restriction based on type
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'textOnly') {
      // Allow only letters and spaces (no numbers or symbols)
      const regex = /^[a-zA-Z\s\u0E00-\u0E7F]*$/;
      if (
        !regex.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab'
      ) {
        e.preventDefault();
      }
    } else if (type === 'numberOnly') {
      // Allow only numbers
      const regex = /^[0-9]*$/;
      if (
        !regex.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab'
      ) {
        e.preventDefault();
      }
    } else if (type === 'textWithSymbols') {
      // Allow letters, numbers, spaces, and common symbols
      const regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
      if (
        !regex.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab'
      ) {
        e.preventDefault();
      }
    } else if (type === 'tel') {
      // Allow numbers, spaces, dashes, parentheses, and plus sign
      const regex = /^[0-9\s\-()+]*$/;
      const currentLength = (e.target as HTMLInputElement).value.length;
      if (
        (!regex.test(e.key) ||
          (currentLength >= 10 &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Tab')) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab'
      ) {
        e.preventDefault();
      }
    }
  };

  // Handle paste events for input restriction
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');

    if (type === 'textOnly') {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(pastedText)) {
        e.preventDefault();
      }
    } else if (type === 'numberOnly') {
      const regex = /^[0-9]*$/;
      if (!regex.test(pastedText)) {
        e.preventDefault();
      }
    } else if (type === 'textWithSymbols') {
      const regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
      if (!regex.test(pastedText)) {
        e.preventDefault();
      }
    }
  };

  // Prepare suffix for password type
  const getSuffix = () => {
    if (type === 'password') {
      return (
        <span
          className="cursor-pointer select-none hover:opacity-70 transition-opacity"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <i className="ri-eye-line text-gray-500"></i>
          ) : (
            <i className="ri-eye-off-line text-gray-500"></i>
          )}
        </span>
      );
    }
    return suffix;
  };

  // Determine actual input type
  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    if (type === 'textOnly' || type === 'textWithSymbols') {
      return 'text';
    }
    if (type === 'numberOnly') {
      return 'text'; // Use text type to have full control over input
    }
    return type;
  };

  const useDataTestId = useDataTestIdWithPath(usePathname(), 'text-field', name, dataTestId);

  const inputNode = (
    <Input
      data-testid={useDataTestId}
      className={`custom-allkons-input ${sizeClass} ${className} [&.ant-input]:!rounded-lg ${
        focusRing
          ? '[&.ant-input-outlined:focus-within]:!border [&.ant-input-outlined:focus-within]:!border-primary [&.ant-input-outlined:focus-within]:!ring-2 [&.ant-input-outlined:focus-within]:!ring-primary-hover'
          : ''
      }`}
      placeholder={placeholder}
      prefix={defaultPrefix}
      suffix={getSuffix()}
      disabled={disabled}
      allowClear={allowClear}
      variant={variant}
      type={getInputType()}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      onKeyPress={handleKeyPress}
      onPaste={handlePaste}
      {...rest}
    />
  );

  // Detect if any rule is required
  const isRequired =
    (Array.isArray(rules) && rules.some((rule) => rule.required === true)) ||
    required;

  // Prepare label with asterisk after, using Tailwind for error color and margin
  const renderLabel = () => {
    if (label) {
      return (
        <span>
          {label}
          {isRequired && <span className="text-error ml-1 text-xs">*</span>}
        </span>
      );
    }
    return undefined;
  };

  // If name or label or rules provided, wrap with Form.Item
  if (name || label || rules) {
    const labelCol = vertical ? { span: 24 } : undefined;
    const wrapperCol = vertical ? { span: 24 } : undefined;
    return (
      <Form.Item
        name={name}
        label={renderLabel()}
        rules={rules}
        required={false} // managed in custom label
        colon={false} // remove default colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        validateStatus={validateStatus}
        help={help}
        className="!mb-0"
        getValueProps={getValueProps}
        {...formItemProps}
      >
        {inputNode}
      </Form.Item>
    );
  }

  return inputNode;
};

export default TextField;
