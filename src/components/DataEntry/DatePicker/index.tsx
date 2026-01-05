'use client';

import React, { ReactNode } from 'react';
import { DatePicker as AntDatePicker, Form, FormItemProps } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import { useDataTestIdWithPath } from '@/utils/DataTestId/data-test-id.utils';
import { usePathname } from 'next/navigation';

const { RangePicker } = AntDatePicker;

interface CustomDatePickerProps
  extends Omit<DatePickerProps, 'value' | 'onChange'> {
  dataTestId?: string;
  label?: ReactNode;
  name?: any;
  required?: boolean;
  requiredMessage?: string;
  rules?: any[];
  tooltip?: string;
  extra?: ReactNode;
  help?: ReactNode;
  validateStatus?: FormItemProps['validateStatus'];
  hasFeedback?: boolean;
  placeholder?: string;
  dateRange?: false;
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null, dateString: string) => void;
  vertical?: boolean;
  getValueFormEvent?: (date: Dayjs | null, dateString: string) => any;
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
}

interface CustomRangePickerProps
  extends Omit<RangePickerProps, 'value' | 'onChange'> {
  dataTestId?: string;
  label?: ReactNode;
  name?: any;
  required?: boolean;
  requiredMessage?: string;
  rules?: any[];
  tooltip?: string;
  extra?: ReactNode;
  help?: ReactNode;
  validateStatus?: FormItemProps['validateStatus'];
  hasFeedback?: boolean;
  placeholder?: [string, string];
  dateRange: true;
  value?: [Dayjs | null, Dayjs | null] | null;
  onChange?: (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => void;
  vertical?: boolean;
  getValueFormEvent?: (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => any;
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
}

type DatePickerComponentProps = CustomDatePickerProps | CustomRangePickerProps;

const DatePicker: React.FC<DatePickerComponentProps> = (props) => {
  const {
    dataTestId,
    label,
    name,
    required = false,
    requiredMessage,
    rules = [],
    tooltip,
    extra,
    help,
    validateStatus,
    hasFeedback,
    placeholder,
    dateRange = false,
    size = 'large',
    vertical = false,
    getValueFormEvent,
    formItemProps,
    ...datePickerProps
  } = props;

  // Set Thai locale
  dayjs.locale('th');

  const defaultRules = [
    ...(required
      ? [
          {
            required: true,
            message: requiredMessage || `กรุณาเลือก${label || 'วันที่'}`,
          },
        ]
      : []),
    ...rules,
  ];

  const commonProps = {
    size,
    style: { width: '100%' },
    format: 'DD/MM/YYYY',
    ...datePickerProps,
  };

  const useDataTestId = useDataTestIdWithPath(usePathname(), 'date-picker', name, dataTestId);

  // Detect if any rule is required
  const isRequired =
    (Array.isArray(rules) && rules.some((rule) => rule.required === true)) ||
    required;

  // Prepare label with asterisk after, using same logic as TextField
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

  const datePickerNode = dateRange ? (
    <RangePicker
      data-testid={useDataTestId}
      {...(commonProps as RangePickerProps)}
      placeholder={(placeholder as [string, string]) || ['เริ่มต้น', 'สิ้นสุด']}
      disabledDate={datePickerProps.disabledDate}
    />
  ) : (
    <AntDatePicker
      data-testid={useDataTestId}
      {...(commonProps as DatePickerProps)}
      placeholder={(placeholder as string) || 'เลือกวันที่'}
      disabledDate={datePickerProps.disabledDate}
    />
  );

  // If name or label or rules provided, wrap with Form.Item (same logic as TextField)
  if (name || label || rules) {
    const labelCol = vertical ? { span: 24 } : undefined;
    const wrapperCol = vertical ? { span: 24 } : undefined;

    return (
      <Form.Item
        name={name}
        label={renderLabel()}
        rules={defaultRules}
        required={false} // managed in custom label
        colon={false} // remove default colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        tooltip={tooltip}
        extra={extra}
        help={help}
        validateStatus={validateStatus}
        hasFeedback={hasFeedback}
        getValueFromEvent={getValueFormEvent}
        className="!mb-0"
        {...formItemProps}
      >
        {datePickerNode}
      </Form.Item>
    );
  }

  return datePickerNode;
};

export default DatePicker;
