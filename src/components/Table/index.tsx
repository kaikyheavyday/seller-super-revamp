"use client";

import { Select, Table } from "antd";
import type { TableProps } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table/interface";
import React, { useEffect } from "react";
import "./custom-table.css";

// Empty State Component
const EmptyStateComponent = ({ message }: { message?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-24 h-24 mb-4 flex items-center justify-center">
      <i className="ri-inbox-2-line text-6xl text-gray-300"></i>
    </div>
    <p className="text-gray-500 text-sm">
      {message || "ไม่พบข้อมูล"}
    </p>
  </div>
);

export interface CustomTableProps<T> extends Omit<TableProps<T>, "columns" | "dataSource"> {
  /** Table columns configuration */
  columns?: ColumnsType<T>;
  /** Data source for the table (alias for dataSource) */
  items?: T[];
  /** Data source for the table */
  dataSource?: T[];
  /** Loading state */
  loading?: boolean;
  /** Pagination configuration or false to disable */
  pagination?: TablePaginationConfig | false;
  /** Callback when pagination, filters or sorter changes */
  onChange?: TableProps<T>["onChange"];
  /** Key for each row (default: 'id') */
  rowKey?: string | ((record: T) => string);
  /** Row event handlers */
  onRow?: TableProps<T>["onRow"];
  /** Table size: 'small' | 'middle' | 'large' */
  size?: "small" | "middle" | "large";
  /** Whether to show borders */
  bordered?: boolean;
  /** Scroll configuration */
  scroll?: TableProps<T>["scroll"];
  /** Row selection configuration */
  rowSelection?: TableProps<T>["rowSelection"];
  /** Custom empty text */
  emptyText?: React.ReactNode;
  /** Whether to show sorter tooltip */
  showSorterTooltip?: boolean;
  /** Table layout: 'auto' | 'fixed' */
  tableLayout?: "auto" | "fixed";
  /** Whether table header is sticky */
  sticky?: boolean | { offsetHeader?: number; offsetScroll?: number };
}

function CustomTable<T extends object = Record<string, unknown>>({
  columns = [],
  items,
  dataSource,
  loading = false,
  pagination,
  onChange,
  rowKey = "id",
  onRow,
  size = "middle",
  bordered = false,
  scroll,
  rowSelection,
  emptyText,
  showSorterTooltip = true,
  tableLayout = "auto",
  sticky,
  ...restProps
}: CustomTableProps<T>) {
  // Use items if provided, otherwise use dataSource
  const data = items || dataSource || [];

  // Default empty state
  const defaultEmptyText = <EmptyStateComponent message={emptyText} />;

  const defaultPagination: TablePaginationConfig = {
    selectComponentClass: (props: React.ComponentProps<typeof Select>) => (
      <Select {...props} showSearch={false} virtual={false} />
    ),
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) =>
      total > 0
        ? `${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ`
        : "0-0 จากทั้งหมด 0 รายการ",
    pageSizeOptions: ["10", "20", "50", "100"],
    hideOnSinglePage: false,
    ...(pagination as TablePaginationConfig),
  };

  // Add event listener to prevent typing in pagination input
  useEffect(() => {
    const handleKeyDown = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target?.classList?.contains("ant-select-selection-search-input") &&
        target?.closest(".ant-pagination-options-size-changer")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keypress", handleKeyDown, true);
    document.addEventListener("input", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keypress", handleKeyDown, true);
      document.removeEventListener("input", handleKeyDown, true);
    };
  }, []);

  return (
    <div className="custom-table-wrapper">
      <Table<T>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination === false ? false : defaultPagination}
        onChange={onChange}
        rowKey={rowKey}
        onRow={onRow}
        size={size}
        bordered={bordered}
        scroll={scroll}
        rowSelection={rowSelection}
        locale={{
          emptyText: defaultEmptyText,
        }}
        showSorterTooltip={showSorterTooltip}
        tableLayout={tableLayout}
        sticky={sticky}
        {...restProps}
        className="
            [&_.ant-table]:!bg-background-secondary
            [&_.ant-table]:!rounded-none
            [&_.ant-table-thead>tr>th]:!border-none
            [&_.ant-table-thead>tr>th]:!font-normal
            [&_.ant-table-thead>tr>th]:!bg-background-secondary
            [&_.ant-table-thead>tr>th::before]:!hidden
            [&_.ant-table-container]:!border-none
            [&_.ant-table-content]:!border-none
            [&_.ant-table-tbody>tr]:!border-none
            [&_td.ant-table-cell]:!bg-white
            [&_td.ant-table-cell]:!py-3
            [&_td.ant-table-cell]:!px-4
            [&_th.ant-table-cell]:!p-4
            [&_.ant-table-tbody_td]:!text-ellipsis
            [&_.ant-table-tbody_td]:!overflow-hidden
            [&_.ant-table-selection-column]:!overflow-visible
            [&_td.ant-table-selection-column]:!text-clip
            [&_th.ant-table-selection-column]:!overflow-visible
            [&_.ant-table-selection-column_.ant-checkbox-inner]:!w-5
            [&_.ant-table-selection-column_.ant-checkbox-inner]:!h-5
            [&_td.ant-table-cell-fix-left]:!bg-white
            [&_th.ant-table-cell-fix-left]:!bg-background-secondary
            [&_th.ant-table-cell-fix-left]:!z-[20]
            [&_td.ant-table-cell-fix-right]:!bg-white
            [&_th.ant-table-cell-fix-right]:!bg-background-secondary
            [&_th.ant-table-cell-fix-right]:!z-[20]
            [&_.ant-pagination]:!mt-6
            [&_.ant-pagination-item]:!min-w-[40px]
            [&_.ant-pagination-item]:!h-[40px]
            [&_.ant-pagination-item]:!leading-[38px]
            [&_.ant-pagination-item]:!border-neutral-30
            [&_.ant-pagination-item]:!rounded-lg
            [&_.ant-pagination-item-active]:!bg-primary
            [&_.ant-pagination-item-active]:!border-primary
            [&_.ant-pagination-item-active>a]:!text-white
            [&_.ant-pagination-prev]:!min-w-[40px]
            [&_.ant-pagination-prev]:!h-[40px]
            [&_.ant-pagination-prev]:!leading-[38px]
            [&_.ant-pagination-prev]:!border
            [&_.ant-pagination-prev]:!border-neutral-30
            [&_.ant-pagination-prev]:!rounded-lg
            [&_.ant-pagination-prev]:!mr-3
            [&_.ant-pagination-next]:!min-w-[40px]
            [&_.ant-pagination-next]:!h-[40px]
            [&_.ant-pagination-next]:!leading-[38px]
            [&_.ant-pagination-next]:!border-neutral-30
            [&_.ant-pagination-next]:!rounded-lg
            [&_.ant-pagination-next]:!border
            [&_.ant-pagination-next]:!ml-3
            [&_.ant-pagination-next]:!mr-6
            [&_.ant-pagination-options]:!h-[40px]
            [&_.ant-select-selector]:!h-[40px]
            [&_.ant-select-selector]:!p-2
            [&_.ant-select-selector]:!rounded-lg
            [&_.ant-select-selector]:!cursor-pointer
            [&_.ant-select-selection-item]:!leading-[38px]
            [&_.ant-select-selection-item]:!cursor-pointer
            [&_.ant-select-arrow]:!top-[20px]
            [&_.ant-pagination-item]:!mx-[2px]
            [&_.ant-table-pagination]:items-center
            [&_.ant-table-pagination]:px-4
            [&_.ant-pagination-total-text]:!mr-auto
            [&_.ant-pagination-options-size-changer_.ant-select-selector]:!outline-none
            [&_.ant-pagination-options-size-changer_.ant-select-selector]:focus:!shadow-none
            [&_.ant-pagination-options-size-changer_.ant-select-selector]:focus:!outline-none
            [&_.ant-select-item-option-selected]:!bg-transparent
            [&_.ant-select-item-option-selected:hover]:!bg-neutral-10
            [&_.ant-select-selection-search-input]:!cursor-pointer
            [&_.ant-select-selection-search-input]:!pointer-events-none
            [&_.ant-select-selection-search-input]:!caret-transparent
            [&_.ant-select-selection-search-input]:!opacity-0
            [&_.ant-select-selection-search-input]:!w-0
            [&_.ant-select-selection-search-input]:!h-0
            [&_.ant-select-selection-item]:!select-none
            [&_.ant-select-selector]:!select-none
            [&_.ant-select-suffix.anticon-search]:!hidden
            [&_.ant-pagination-total-text]:!w-full
            [&_.ant-pagination-total-text]:!flex
            [&_.ant-pagination-total-text]:!justify-center
            [&_.ant-pagination-total-text]:lg:!w-auto
            [&_.ant-pagination-total-text]:lg:!justify-start
            [&_.ant-pagination-end]:!justify-center
            [&_.ant-pagination-end]:lg:!justify-end
        "
      />
    </div>
  );
}

export default CustomTable;
