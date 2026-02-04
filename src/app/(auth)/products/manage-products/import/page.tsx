"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Popover } from "antd";
import { useRouter } from "next/navigation";
import Typography from "@/components/Typography";
import CustomButton from "@/components/Button";
import SelectField from "@/components/DataEntry/Select";
import TextField from "@/components/DataEntry/TextField";
import CustomTable from "@/components/Table";
import BadgeLabel from "@/components/BadgeLabel";
import { getProductImport } from "@/api/product.api";
import { getCategoriesByProductVariant } from "@/api/category.api";
import { useUserStore } from "@/store/user.store";
import { ICategoryTree } from "@/interfaces/category/category.response.interface";
import { routes } from "@/app/constants/routing.constants";

// Types
interface Filter {
  searchType: string;
  search: string;
}

interface ProductImportItem {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  image: string;
  productVariant?: {
    id: number;
    product?: {
      category?: {
        id: number;
        name: string;
      };
    };
  };
}

// Constants
const SEARCH_TYPE_OPTIONS = [
  { value: "all", label: "เกี่ยวข้องกับสินค้า" },
  { value: "name", label: "ชื่อสินค้า" },
  { value: "barcode", label: "บาร์โค้ด (Barcode)" },
  { value: "brand", label: "แบรนด์สินค้า" },
];

export default function ImportProductsPage() {
  const router = useRouter();
  const { merchant } = useUserStore();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductImportItem[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<Filter | null>(null);
  const [tempFilter, setTempFilter] = useState<Filter>({
    searchType: "all",
    search: "",
  });
  const [products, setProducts] = useState<ProductImportItem[]>([]);
  const [total, setTotal] = useState(0);

  // Collect unique productVariantIds and categoryIds from products
  const { productVariantIds, categoryIds } = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const variantId = product.productVariant?.id;
        const categoryId = product.productVariant?.product?.category?.id;

        if (variantId && !acc.productVariantIds.includes(variantId)) {
          acc.productVariantIds.push(variantId);
        }
        if (categoryId && !acc.categoryIds.includes(categoryId)) {
          acc.categoryIds.push(categoryId);
        }

        return acc;
      },
      { productVariantIds: [] as number[], categoryIds: [] as number[] },
    );
  }, [products]);

  // Function to build category path from nested child structure
  const buildCategoryPath = (
    categoryTree: ICategoryTree | null,
  ): { fullPath: string; pathWithoutLast: string; lastItem: string } => {
    if (!categoryTree) {
      return { fullPath: "", pathWithoutLast: "", lastItem: "" };
    }

    const path: string[] = [];
    let current: ICategoryTree | null = categoryTree;

    while (current) {
      path.push(current.name);
      current = current.child;
    }

    const fullPath = path.join(" > ");
    const lastItem = path.length > 0 ? path[path.length - 1] : "";
    const pathWithoutLast =
      path.length > 1 ? path.slice(0, -1).join(" > ") : "";

    return { fullPath, pathWithoutLast, lastItem };
  };

  // Create stable query key using sorted string
  const categoryIdsKey = useMemo(() => {
    return categoryIds.length > 0
      ? categoryIds.sort((a, b) => a - b).join(",")
      : "";
  }, [categoryIds]);

  const productVariantIdsString = useMemo(() => {
    return productVariantIds.length > 0 ? productVariantIds.join(",") : "";
  }, [productVariantIds]);

  // Fetch category hierarchy
  const { data: categoryHierarchyData } = useQuery({
    queryKey: ["category-hierarchy-import", categoryIdsKey],
    queryFn: () => getCategoriesByProductVariant(productVariantIdsString),
    enabled: categoryIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Create a map of productVariantId to category path
  const categoryPathMap = useMemo(() => {
    const map: Record<
      number,
      { fullPath: string; pathWithoutLast: string; lastItem: string }
    > = {};
    const items = categoryHierarchyData?.data?.items;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        map[item.productVariantId] = buildCategoryPath(item.categoryTree);
      });
    }
    return map;
  }, [categoryHierarchyData]);

  // Call API get product import
  const { mutateAsync: fetchProductImport, isPending: isLoading } = useMutation(
    {
      mutationFn: (params: {
        page: number;
        pageLimit: number;
        search?: string;
        searchType?: string;
      }) => getProductImport(merchant?.merchantSlug || "", params),
      onSuccess: (data) => {
        setProducts((data?.data as any)?.items || []);
        setTotal((data?.data as any)?.meta?.totalItems || 0);
      },
    },
  );

  // Fetch products when filter changes
  useEffect(() => {
    if (filter && merchant?.merchantSlug) {
      fetchProductImport({
        page: currentPage,
        pageLimit: pageSize,
        search: filter.search || undefined,
        searchType: filter.searchType !== "all" ? filter.searchType : undefined,
      });
    }
  }, [filter, currentPage, pageSize, merchant?.merchantSlug]);

  // Reset page when pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Table columns
  const tableColumns = useMemo(
    () => [
      {
        title: "รายการสินค้า/แบรนด์",
        dataIndex: "image",
        key: "image",
        width: "70%",
        render: (_: unknown, record: ProductImportItem) => {
          return (
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {record.image ? (
                  <img
                    src={record.image}
                    alt={record.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <i className="ri-image-line text-2xl text-gray-400"></i>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <Popover
                  content={
                    <div className="max-w-[400px]">
                      <Typography
                        variant="paragraph-small"
                        className="!text-text-primary !font-medium"
                      >
                        ชื่อสินค้า
                      </Typography>
                      <Typography
                        variant="paragraph-small"
                        className="!text-text-primary !font-normal break-words"
                      >
                        {record.name}
                      </Typography>
                    </div>
                  }
                  trigger="click"
                  placement="top"
                  overlayStyle={{ maxWidth: "400px" }}
                >
                  <div
                    className="text-sm text-text-primary font-normal cursor-pointer overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {record.name}
                  </div>
                </Popover>
                <Typography
                  variant="paragraph-extra-small"
                  className="!text-text-tertiary"
                >
                  {record.brand || "-"}
                </Typography>
              </div>
            </div>
          );
        },
      },
      {
        title: "Barcode",
        dataIndex: "barcode",
        key: "barcode",
        width: 150,
        render: (barcode: string) => (
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary whitespace-nowrap"
          >
            {barcode || "-"}
          </Typography>
        ),
      },
      {
        title: "หมวดหมู่",
        dataIndex: "categoryName",
        key: "categoryName",
        width: 200,
        render: (_: unknown, record: ProductImportItem) => {
          const categoryName = record.productVariant?.product?.category?.name;
          const productVariantId = record.productVariant?.id;
          const categoryPathData = productVariantId
            ? categoryPathMap[productVariantId] || {
                fullPath: "-",
                pathWithoutLast: "-",
                lastItem: "",
              }
            : { fullPath: "-", pathWithoutLast: "-", lastItem: "" };

          return categoryName ? (
            <Popover
              content={
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-primary !font-medium"
                  >
                    หมวดหมู่
                  </Typography>
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-secondary break-words"
                  >
                    {categoryPathData.pathWithoutLast && (
                      <span className="text-gray-400">
                        {categoryPathData.pathWithoutLast}
                      </span>
                    )}
                    {categoryPathData.lastItem && (
                      <span className="!font-semibold">
                        {categoryPathData.pathWithoutLast
                          ? ` > ${categoryPathData.lastItem}`
                          : categoryPathData.lastItem}
                      </span>
                    )}
                  </Typography>
                </div>
              }
              trigger="click"
              placement="top"
              overlayStyle={{ maxWidth: "400px" }}
            >
              <div>
                <BadgeLabel
                  text={categoryName}
                  color="brand"
                  variant="ghost"
                  rounding="pill"
                />
              </div>
            </Popover>
          ) : (
            <Typography
              variant="paragraph-small"
              className="!text-text-tertiary"
            >
              ไม่ระบุ
            </Typography>
          );
        },
      },
    ],
    [categoryPathMap],
  );

  const handleSearch = () => {
    setCurrentPage(1);
    setFilter({ ...tempFilter });
  };

  const handleReset = () => {
    const initialFilter = {
      searchType: "all",
      search: "",
    };
    setTempFilter(initialFilter);
    setSelectedRowKeys([]);
    setSelectedProducts([]);
    setCurrentPage(1);
    setFilter(null);
    setProducts([]);
    setTotal(0);
  };

  return (
    <div>
      <div>
        <CustomButton
          variant="link"
          className="!px-0"
          icon={<i className="ri-arrow-left-line" />}
          color="neutral"
          onClick={() => router.push(routes.productList())}
        >
          ย้อนกลับ
        </CustomButton>
        <Typography variant="h3" className="!text-text-primary !font-bold">
          เพิ่มสินค้าจากระบบ
        </Typography>
        <Typography variant="paragraph-medium" className="!text-text-tertiary">
          คุณกำลังเลือกสินค้าจากระบบเข้าร้านค้า
        </Typography>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {/* Filter Section */}
        <div className="p-6 bg-white rounded-lg relative shadow-sm">
          <div className="grid grid-cols-4 gap-4">
            <SelectField
              label="ประเภทคำค้นหา"
              placeholder="เลือกประเภทการค้นหา"
              options={SEARCH_TYPE_OPTIONS}
              vertical
              value={tempFilter.searchType}
              onChange={(value) =>
                setTempFilter({ ...tempFilter, searchType: value as string })
              }
            />
            <TextField
              label="ค้นหา"
              vertical
              placeholder="บาร์โค้ด แบรนด์ หรือชื่อสินค้า"
              prefix={<i className="ri-search-line"></i>}
              value={tempFilter.search}
              onChange={(e) =>
                setTempFilter({ ...tempFilter, search: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              maxLength={100}
            />
          </div>
          <div className="flex gap-2 absolute bottom-6 right-6">
            <CustomButton
              color="neutral"
              variant="outlined"
              onClick={handleReset}
            >
              ล้างค่า
            </CustomButton>
            <CustomButton onClick={handleSearch}>ค้นหา</CustomButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-auto">
          <div className="py-6 px-4 flex justify-between items-center">
            <Typography
              variant="paragraph-medium"
              className="!text-text-secondary !font-semibold"
            >
              สินค้าทั้งหมด {total} รายการ
            </Typography>
          </div>
          <div>
            <CustomTable<ProductImportItem>
              columns={tableColumns}
              items={products}
              loading={isLoading}
              rowKey="id"
              rowSelection={{
                selectedRowKeys: selectedProducts.map((product) => product.id),
                onChange: (selectedKeys) => {
                  const currentPageProducts = products.filter((product) =>
                    selectedKeys.includes(product.id),
                  );

                  // Keep products from other pages and add/update current page selections
                  const otherPageProducts = selectedProducts.filter(
                    (product) => !products.some((p) => p.id === product.id),
                  );

                  const newSelectedProducts = [
                    ...otherPageProducts,
                    ...currentPageProducts,
                  ];

                  setSelectedProducts(newSelectedProducts);
                  setSelectedRowKeys(newSelectedProducts.map((p) => p.id));
                },
                columnWidth: 56,
                fixed: true,
              }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                  }
                },
                locale: {
                  items_per_page: " / หน้า",
                  prev_page: "ย้อนกลับ",
                  next_page: "หน้าถัดไป",
                },
              }}
              emptyText={
                <Typography
                  variant="paragraph-medium"
                  className="!font-medium !text-text-secondary"
                >
                  ไม่พบสินค้า
                </Typography>
              }
              tableLayout="fixed"
              scroll={{ x: 900 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <CustomButton
            color="neutral"
            variant="outlined"
            onClick={() => router.push(routes.productList())}
          >
            ยกเลิก
          </CustomButton>
          <CustomButton
            onClick={() => {
              // TODO: Handle add products
              console.log("Selected products:", selectedProducts);
            }}
            disabled={selectedProducts.length === 0}
          >
            {selectedProducts.length === 0
              ? "เพิ่มสินค้า"
              : `เพิ่มสินค้า ${selectedProducts.length} รายการ`}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
