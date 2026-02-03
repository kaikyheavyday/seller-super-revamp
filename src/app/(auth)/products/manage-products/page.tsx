"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Popover, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import Typography from "@/components/Typography";
import ResponsivePopup from "@/components/Popup";
import CustomButton from "@/components/Button";
import SelectField from "@/components/DataEntry/Select";
import TextField from "@/components/DataEntry/TextField";
import ToggleSwitch from "@/components/DataEntry/ToggleSwitch";
import CustomTable from "@/components/Table";
import BadgeLabel from "@/components/BadgeLabel";
import {
  getMerchantProducts,
  getMerchantsProductCount,
  getMasterDataProduct,
  getProductVariantImages,
} from "@/api/product.api";
import {
  getCategories,
  getCategoriesByProductVariant,
} from "@/api/category.api";
import { useUserStore } from "@/store/user.store";
import {
  IProductResponseMerchantProduct,
  IResponseProductVariantImage,
} from "@/interfaces/product/product.response.interface";
import {
  ICategoryResponse,
  ICategoryByProductVariantResponse,
  ICategoryTree,
} from "@/interfaces/category/category.response.interface";

// Types
interface Filter {
  searchType: string;
  search: string;
  productType: string;
  status: string;
  categories?: number[];
}

// Constants
const PRICE_DISPLAY_OPTIONS = [
  { value: "with-vat", label: "ราคารวมภาษี" },
  { value: "without-vat", label: "ราคาไม่รวมภาษี" },
];

const PRICE_DISPLAY_MODES = {
  WITH_VAT: "with-vat",
  WITHOUT_VAT: "without-vat",
};

const SEARCH_TYPE_OPTIONS = [
  { value: "all", label: "เกี่ยวข้องกับสินค้า" },
  { value: "name", label: "ชื่อสินค้า" },
  { value: "barcode", label: "บาร์โค้ด (Barcode)" },
  { value: "brandName", label: "แบรนด์สินค้า" },
];

// Helper Functions
const formatNumber = (num: number | null, decimals: number = 2): string => {
  if (num === null || num === undefined) return "0.00";
  return num.toLocaleString("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Selling":
      return { label: "ขายอยู่", color: "success" as const };
    case "Hidden":
      return { label: "ไม่แสดง", color: "neutral" as const };
    case "OutOfStock":
      return { label: "ถูกระงับ", color: "error" as const };
    case "NotApproved":
      return { label: "รอจัดการราคา", color: "warning" as const };
    default:
      return { label: status, color: "neutral" as const };
  }
};

export default function Products() {
  const { merchant } = useUserStore();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<Filter>({
    searchType: "all",
    search: "",
    productType: "all",
    status: "ALL",
  });
  const [tempFilter, setTempFilter] = useState({
    searchType: "all",
    search: "",
    productType: "all",
  });
  const [priceDisplayMode, setPriceDisplayMode] = useState(
    PRICE_DISPLAY_MODES.WITHOUT_VAT,
  );
  const [showVatDetails, setShowVatDetails] = useState(true);

  // Category filter states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<React.Key[]>([]);
  const [tempCategoryFilter, setTempCategoryFilter] = useState<React.Key[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchCategoryInput, setSearchCategoryInput] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // Fetch products from API
  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      "merchantProducts",
      merchant?.merchantId,
      currentPage,
      pageSize,
      filter.search,
      filter.searchType,
      filter.productType,
      filter.categories,
      filter.status,
    ],
    queryFn: () =>
      getMerchantProducts(merchant?.merchantSlug || "", {
        page: currentPage,
        pageLimit: pageSize,
        search: filter.search || undefined,
        searchType: filter.searchType !== "all" ? filter.searchType : undefined,
        productTypeId:
          filter.productType !== "all" ? Number(filter.productType) : undefined,
        categoryIds:
          filter.categories && filter.categories.length > 0
            ? filter.categories.join(",")
            : undefined,
        ...(filter.status && filter.status !== "ALL"
          ? { merchantProductStatus: filter.status }
          : {}),
      }),
    enabled: !!merchant?.merchantSlug,
  });

  // Get products and meta from API response
  const products = productsData?.data?.items || [];
  const meta = productsData?.data?.meta;
  const totalItems = meta?.totalItems || 0;

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categoryData = categoriesData?.data || [];

  // Fetch status counts
  const { data: statusCountData } = useQuery({
    queryKey: [
      "merchantProductStatusCount",
      merchant?.merchantId,
      filter.search,
      filter.searchType,
      filter.productType,
      filter.categories,
    ],
    queryFn: () => getMerchantsProductCount(merchant?.merchantSlug || ""),
    enabled: !!merchant?.merchantSlug,
  });

  // Fetch product type master data
  const { data: productTypeData } = useQuery({
    queryKey: ["masterDataProductType"],
    queryFn: () => getMasterDataProduct("ProductType"),
  });

  // Collect unique productVariantIds from products
  const productVariantIds = useMemo(() => {
    const ids = products
      .map((p) => p.productVariant?.id)
      .filter((id): id is number => id !== undefined);
    return ids.length > 0 ? ids.join(",") : "";
  }, [products]);

  // Fetch product variant images
  const { data: productVariantImagesData } = useQuery({
    queryKey: ["productVariantImages", merchant?.merchantId, productVariantIds],
    queryFn: () =>
      getProductVariantImages(merchant?.merchantSlug || "", productVariantIds),
    enabled: !!merchant?.merchantSlug && productVariantIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch category hierarchy
  const { data: categoryHierarchyData } = useQuery({
    queryKey: ["categoryHierarchy", productVariantIds],
    queryFn: () => getCategoriesByProductVariant(productVariantIds),
    enabled: productVariantIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Create product type options from API data
  const productTypeOptions = useMemo(
    () => [
      { value: "all", label: "ทั้งหมด" },
      ...(productTypeData?.data || []).map((item) => ({
        value: String(item.id),
        label: item.name_th,
      })),
    ],
    [productTypeData],
  );

  // Create image map
  const productImageMap = useMemo(() => {
    const map: Record<number, string> = {};
    const images = productVariantImagesData?.data;
    if (Array.isArray(images)) {
      images.forEach((item: IResponseProductVariantImage) => {
        if (!map[item.productVariantId] && item.imageUpload?.url) {
          map[item.productVariantId] = item.imageUpload.url;
        }
      });
    }
    return map;
  }, [productVariantImagesData]);

  // Build category path from nested structure
  const buildCategoryPath = (
    categoryTree: ICategoryTree | null,
  ): { fullPath: string; pathWithoutLast: string; lastItem: string } => {
    if (!categoryTree) {
      return { fullPath: "-", pathWithoutLast: "-", lastItem: "" };
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

  // Create category path map
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

  // Filter products based on status (client-side for status tabs)
  const filteredProducts = useMemo(() => {
    if (filter.status === "ALL") return products;
    return products.filter(
      (product) => product.merchantProductStatus === filter.status,
    );
  }, [filter.status, products]);

  // Use status counts from API
  const statusCounts = statusCountData?.data || {
    ALL: 0,
    Selling: 0,
    Hidden: 0,
    OutOfStock: 0,
    NotApproved: 0,
  };

  const productStatusTabs = useMemo(
    () => [
      { label: "ทั้งหมด", value: "ALL", count: statusCounts.ALL },
      { label: "ขายอยู่", value: "Selling", count: statusCounts.Selling },
      { label: "ไม่แสดง", value: "Hidden", count: statusCounts.Hidden },
      {
        label: "ถูกระงับ",
        value: "OutOfStock",
        count: statusCounts.OutOfStock,
      },
      {
        label: "รอจัดการราคา",
        value: "NotApproved",
        count: statusCounts.NotApproved,
      },
    ],
    [statusCounts],
  );

  // Transform category data to tree format
  const transformCategoryToTreeData = (
    categories: ICategoryResponse[],
  ): DataNode[] => {
    return categories.map((cat) => ({
      title: cat.name,
      key: cat.id,
      children:
        cat.children && cat.children.length > 0
          ? transformCategoryToTreeData(cat.children)
          : undefined,
    }));
  };

  // Filter tree data based on search
  const filterTreeData = (data: DataNode[], searchText: string): DataNode[] => {
    if (!searchText) return data;

    const filtered: DataNode[] = [];
    for (const node of data) {
      const title = String(node.title || "");
      const matches = title.toLowerCase().includes(searchText.toLowerCase());
      const filteredChildren = node.children
        ? filterTreeData(node.children, searchText)
        : [];

      if (matches || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children:
            filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
    }
    return filtered;
  };

  // Highlight matching text
  const highlightText = (text: string, searchText: string) => {
    if (!searchText) return text;
    const parts = text.split(new RegExp(`(${searchText})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === searchText.toLowerCase() ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  // Get highlighted tree data
  const getHighlightedTreeData = (
    data: DataNode[],
    searchText: string,
  ): DataNode[] => {
    return data.map((node) => ({
      ...node,
      title: highlightText(String(node.title), searchText),
      children: node.children
        ? getHighlightedTreeData(node.children, searchText)
        : undefined,
    }));
  };

  // Get all keys for expansion
  const getAllKeys = (data: DataNode[]): React.Key[] => {
    const keys: React.Key[] = [];
    const traverse = (nodes: DataNode[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return keys;
  };

  // Get selected category names with keys
  const getSelectedCategoryNamesWithKeys = (
    keys: React.Key[],
    treeData: DataNode[],
  ): Array<{ id?: React.Key; name: string; keys: React.Key[] }> => {
    const result: Array<{ id?: React.Key; name: string; keys: React.Key[] }> =
      [];

    const findNames = (data: DataNode[]) => {
      data.forEach((node) => {
        const isSelected = keys.includes(node.key);
        const hasChildren = node.children && node.children.length > 0;

        if (hasChildren && node.children) {
          // Check if all children are selected
          const getAllChildKeys = (children: DataNode[]): React.Key[] => {
            const childKeys: React.Key[] = [];
            children.forEach((child) => {
              childKeys.push(child.key);
              if (child.children && child.children.length > 0) {
                childKeys.push(...getAllChildKeys(child.children));
              }
            });
            return childKeys;
          };

          const allChildKeys = getAllChildKeys(node.children);
          const allChildrenSelected = allChildKeys.every((key) =>
            keys.includes(key),
          );

          if (allChildrenSelected && isSelected) {
            // If all children selected, show only parent
            result.push({
              id: node.key,
              name: String(node.title),
              keys: [node.key, ...allChildKeys],
            });
          } else {
            // Otherwise, recurse into children
            findNames(node.children);
          }
        } else {
          // Leaf node - add if selected
          if (isSelected) {
            result.push({ name: String(node.title), keys: [node.key] });
          }
        }
      });
    };

    findNames(treeData);
    return result;
  };

  const categoryTreeData = transformCategoryToTreeData(categoryData);
  const filteredTreeData = filterTreeData(categoryTreeData, searchCategory);
  const highlightedTreeData = getHighlightedTreeData(
    filteredTreeData,
    searchCategory,
  );
  const visibleKeys = useMemo(
    () => getAllKeys(filteredTreeData),
    [filteredTreeData],
  );

  const selectedCategoryData = getSelectedCategoryNamesWithKeys(
    selectedCategories,
    categoryTreeData,
  );

  const selectedFilterCategories = getSelectedCategoryNamesWithKeys(
    filter.categories?.map((id) => id) || [],
    categoryTreeData,
  );

  // Category search handlers
  const handleSearchCategory = () => {
    setSearchCategory(searchCategoryInput);
    if (searchCategoryInput) {
      setExpandedKeys(visibleKeys);
      if (treeContainerRef.current) {
        setTimeout(() => {
          treeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
    } else {
      setExpandedKeys([]);
    }
  };

  const handleResetCategory = () => {
    setSelectedCategories([]);
    setExpandedKeys([]);
    setSearchCategoryInput("");
    setSearchCategory("");
  };

  // Get all parent keys of selected categories
  const getParentKeysOfSelectedCategories = (
    selectedKeys: React.Key[],
    treeData: DataNode[],
  ): React.Key[] => {
    const parentKeys = new Set<React.Key>();
    const selectedSet = new Set(selectedKeys);

    const findParentKeys = (
      nodes: DataNode[],
      currentPath: React.Key[] = [],
    ) => {
      nodes.forEach((node) => {
        const isSelected = selectedSet.has(node.key);

        if (isSelected) {
          // Add all parent keys (exclude the node itself)
          currentPath.forEach((key) => parentKeys.add(key));
          // Don't traverse children if this node is selected
          return;
        }

        if (node.children && node.children.length > 0) {
          findParentKeys(node.children, [...currentPath, node.key]);
        }
      });
    };

    findParentKeys(treeData);
    return Array.from(parentKeys);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setFilter({
      ...tempFilter,
      status: filter.status,
      categories:
        tempCategoryFilter.length > 0
          ? tempCategoryFilter.map((key) => Number(key))
          : undefined,
    });
  };

  const handleReset = () => {
    const initialFilter = {
      searchType: "all",
      search: "",
      productType: "all",
    };
    setTempFilter(initialFilter);
    setSelectedCategories([]);
    setTempCategoryFilter([]);
    setCurrentPage(1);
    setFilter({ ...initialFilter, status: filter.status });
  };

  const tableColumns = useMemo(
    () => [
      {
        title: "รายการสินค้า/แบรนด์",
        dataIndex: "image",
        key: "image",
        width: 364,
        render: (_: unknown, record: IProductResponseMerchantProduct) => {
          const imageUrl =
            record.thumbnail ||
            productImageMap[record.productVariant?.id] ||
            null;
          return (
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={record.productVariant?.alias || "Product"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <i className="ri-image-line text-2xl text-gray-400"></i>
                )}
              </div>
              <div className="flex flex-col justify-center w-[calc(100%-64px)]">
                <Popover
                  content={
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="paragraph-small"
                        className="!text-text-primary !font-medium"
                      >
                        ชื่อสินค้า
                      </Typography>
                      <Typography
                        variant="paragraph-small"
                        className="!text-text-secondary"
                      >
                        {record.productVariant?.alias || "-"}
                      </Typography>
                    </div>
                  }
                  trigger="click"
                  placement="top"
                >
                  <div>
                    <Typography
                      variant="paragraph-small"
                      className="!text-text-primary !font-normal cursor-pointer hover:text-primary"
                    >
                      {record.productVariant?.alias || "-"}
                    </Typography>
                  </div>
                </Popover>
                <Typography
                  variant="paragraph-extra-small"
                  className="!text-text-tertiary"
                >
                  {record.productVariant?.product?.brand?.name || "-"}
                </Typography>
              </div>
            </div>
          );
        },
      },
      {
        title: "Barcode",
        dataIndex: "barCode",
        key: "barcode",
        width: 160,
        render: (_: unknown, record: IProductResponseMerchantProduct) => (
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {record.productVariant?.barcode || "-"}
          </Typography>
        ),
      },
      {
        title: "หมวดหมู่",
        dataIndex: "productCategory",
        key: "productCategory",
        width: 160,
        render: (_, record) => {
          const categoryName = record.productVariant?.product?.category?.name;
          const productVariantId = record.productVariant?.id;
          const categoryPathData = categoryPathMap[productVariantId] || {
            fullPath: "-",
            pathWithoutLast: "-",
            lastItem: "",
          };

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
                      <span className="text-gray-light">
                        {categoryPathData.pathWithoutLast}
                      </span>
                    )}
                    {categoryPathData.lastItem && (
                      <span className="!font-weight-bold">
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
      {
        title: "ราคาปกติ",
        dataIndex: "price",
        key: "price",
        width: 160,
        render: (_: unknown, record: IProductResponseMerchantProduct) => {
          const isNotApproved = record.merchantProductStatus === "NotApproved";
          const mainPrice =
            priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
              ? record.priceIncludeVat
              : record.priceExcludeVat;
          const altPrice =
            priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
              ? record.priceExcludeVat
              : record.priceIncludeVat;

          if (isNotApproved && mainPrice === 0) {
            return (
              <Typography
                variant="paragraph-small"
                className="!text-text-secondary"
              >
                -
              </Typography>
            );
          }

          return (
            <div className="flex flex-col">
              <Typography
                variant="paragraph-small"
                className="!text-text-primary !font-medium"
              >
                ฿{formatNumber(mainPrice)}
              </Typography>
              {showVatDetails && (
                <>
                  <Typography
                    variant="paragraph-extra-small"
                    className="!text-text-tertiary"
                  >
                    {priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
                      ? "ไม่รวมภาษี"
                      : "รวมภาษี"}{" "}
                    ฿{formatNumber(altPrice)}
                  </Typography>
                  <Typography
                    variant="paragraph-extra-small"
                    className="!text-text-tertiary"
                  >
                    VAT {record.priceVatPercent}%
                  </Typography>
                </>
              )}
            </div>
          );
        },
      },
      {
        title: "ราคาพิเศษ",
        dataIndex: "specialPrice",
        key: "specialPrice",
        width: 160,
        render: (_: unknown, record: IProductResponseMerchantProduct) => {
          const hasSpecialPrice =
            record.specialPriceIncludeVat || record.specialPriceExcludeVat;

          if (!hasSpecialPrice) {
            return (
              <Typography
                variant="paragraph-small"
                className="!text-text-tertiary"
              >
                ไม่ระบุ
              </Typography>
            );
          }

          const mainPrice =
            priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
              ? record.specialPriceIncludeVat
              : record.specialPriceExcludeVat;
          const altPrice =
            priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
              ? record.specialPriceExcludeVat
              : record.specialPriceIncludeVat;

          return (
            <div className="flex flex-col">
              <Typography
                variant="paragraph-small"
                className="!text-primary !font-medium"
              >
                ฿{formatNumber(mainPrice || 0)}
              </Typography>
              {showVatDetails && (
                <>
                  <Typography
                    variant="paragraph-extra-small"
                    className="!text-text-tertiary"
                  >
                    {priceDisplayMode === PRICE_DISPLAY_MODES.WITH_VAT
                      ? "ไม่รวมภาษี"
                      : "รวมภาษี"}{" "}
                    ฿{formatNumber(altPrice || 0)}
                  </Typography>
                  <Typography
                    variant="paragraph-extra-small"
                    className="!text-text-tertiary"
                  >
                    VAT {record.specialPriceVatPercent}%
                  </Typography>
                </>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <div className="flex items-center gap-2">
            <span>ลด</span>
            <Popover
              content={
                <div className="flex flex-col gap-1 max-w-xs">
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-secondary"
                  >
                    เปอร์เซ็นต์ส่วนลด
                    ระบบจะคำนวณส่วนลดโดยอ้างอิงจากราคาปกติและราคาพิเศษ
                  </Typography>
                </div>
              }
              trigger="click"
              placement="top"
            >
              <i className="ri-information-line cursor-pointer text-text-tertiary"></i>
            </Popover>
          </div>
        ),
        dataIndex: "discount",
        key: "discount",
        width: 100,
        render: (_: unknown, record: IProductResponseMerchantProduct) => {
          if (
            !record.specialPriceIncludeVat ||
            !record.priceIncludeVat ||
            record.priceIncludeVat === 0
          ) {
            return (
              <Typography
                variant="paragraph-small"
                className="!text-text-tertiary"
              >
                -
              </Typography>
            );
          }

          const discount = Math.round(
            ((record.priceIncludeVat - record.specialPriceIncludeVat) /
              record.priceIncludeVat) *
              100,
          );

          return (
            <BadgeLabel
              text={`${discount}%`}
              color="error"
              variant="ghost"
              size="small"
              rounding="pill"
            />
          );
        },
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (_: unknown, record: IProductResponseMerchantProduct) => {
          const statusConfig = getStatusConfig(record.merchantProductStatus);
          return (
            <BadgeLabel
              text={statusConfig.label}
              color={statusConfig.color}
              variant="ghost"
              size="small"
              rounding="pill"
            />
          );
        },
      },
      {
        title: "ประเภทสินค้า",
        dataIndex: "productType",
        key: "productType",
        width: 140,
        render: (_: unknown, record: IProductResponseMerchantProduct) => (
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {record.productType?.name_th || record.productType?.name || "-"}
          </Typography>
        ),
      },
      {
        title: (
          <div className="flex items-center gap-2 justify-center">
            <span>เวลาจัดเตรียม (วัน)</span>
            <Popover
              content={
                <div className="flex flex-col gap-1 max-w-xs">
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-primary !font-medium"
                  >
                    จำนวนวันที่ร้านค้าใช้เตรียมสินค้า
                  </Typography>
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-secondary"
                  >
                    นับจากวันที่รับคำสั่งซื้อ จนถึงวันที่ผู้ซื้อยืนยันคำสั่งซื้อ
                    (0 วัน คือ ส่งทันที)
                  </Typography>
                </div>
              }
              trigger="click"
              placement="top"
            >
              <i className="ri-information-line cursor-pointer text-text-tertiary"></i>
            </Popover>
          </div>
        ),
        dataIndex: "prepareDays",
        key: "prepareDays",
        width: 180,
        align: "center" as const,
        render: (_: unknown, record: IProductResponseMerchantProduct) => (
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {record.prepareDays ?? 0}
          </Typography>
        ),
      },
      {
        title: "จัดการ",
        key: "action",
        fixed: "right" as const,
        width: 120,
        render: (_: unknown, record: IProductResponseMerchantProduct) => (
          <div className="flex gap-2">
            <CustomButton
              variant="ghost"
              color="neutral"
              onClick={() => console.log("Edit", record)}
              icon={<i className="ri-edit-line"></i>}
              fitContent
            />
            <CustomButton
              variant="ghost"
              color="error"
              onClick={() => console.log("Delete", record)}
              icon={<i className="ri-delete-bin-line"></i>}
              fitContent
            />
          </div>
        ),
      },
    ],
    [priceDisplayMode, showVatDetails, productImageMap, categoryPathMap],
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <Typography variant="h3" className="!text-text-primary !font-bold">
            สินค้าร้านค้า
          </Typography>
          <Typography
            variant="paragraph-medium"
            className="!text-text-tertiary"
          >
            คุณกำลังจัดการสินค้าในร้านค้า
          </Typography>
        </div>
        <div className="flex gap-3">
          <CustomButton
            variant="outlined"
            color="primary"
            icon={<i className="ri-download-line"></i>}
          >
            นำเข้า/อัปเดตสินค้า
          </CustomButton>
          <CustomButton icon={<i className="ri-add-line"></i>}>
            เพิ่มสินค้าจากระบบ
          </CustomButton>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {/* Filter Section */}
        <div className="p-6 bg-white rounded-lg">
          <div className="flex flex-wrap gap-3 justify-between items-end">
            <div className="grid grid-cols-4 gap-4 flex-0 md:flex-1">
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
                placeholder={
                  tempFilter.searchType === "all"
                    ? "บาร์โค้ด แบรนด์ หรือชื่อสินค้า"
                    : tempFilter.searchType === "name"
                      ? "ชื่อสินค้า"
                      : tempFilter.searchType === "barcode"
                        ? "บาร์โค้ด (Barcode)"
                        : tempFilter.searchType === "brandName"
                          ? "แบรนด์สินค้า"
                          : "ค้นหา..."
                }
                prefix={<i className="ri-search-line"></i>}
                value={tempFilter.search}
                onChange={(e) =>
                  setTempFilter({ ...tempFilter, search: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    setFilter({
                      ...tempFilter,
                      status: filter.status,
                      categories:
                        tempCategoryFilter.length > 0
                          ? tempCategoryFilter.map((key) => Number(key))
                          : undefined,
                    });
                  }
                }}
              />
              <SelectField
                label="ประเภทสินค้า"
                placeholder="เลือกประเภทสินค้า"
                options={productTypeOptions}
                vertical
                value={tempFilter.productType}
                onChange={(value) =>
                  setTempFilter({ ...tempFilter, productType: value as string })
                }
              />
              <div className="flex flex-col gap-2">
                <Typography variant="paragraph-small">
                  หมวดหมู่สินค้า
                </Typography>
                <div
                  className="w-fit h-fit cursor-pointer flex gap-2 items-center justify-center px-4 py-2 border border-border-primary rounded-xl"
                  onClick={() => {
                    if (tempCategoryFilter?.length > 0) {
                      setSelectedCategories(tempCategoryFilter);
                      // Set expanded keys to show parent nodes of selected categories
                      const parentKeys = getParentKeysOfSelectedCategories(
                        tempCategoryFilter,
                        categoryTreeData,
                      );
                      setExpandedKeys([]);
                    }
                    setIsCategoryModalOpen(true);
                  }}
                >
                  <i className="ri-list-check-2 text-xl" />
                  <Typography
                    variant="paragraph-medium"
                    className="!text-text-primary !font-semibold !line-clamp-1"
                  >
                    เลือกหมวดหมู่สินค้า
                  </Typography>
                  {tempCategoryFilter.length > 0 && (
                    <div className="bg-primary w-5 h-5 text-xs text-white rounded-full flex justify-center items-center">
                      {
                        getSelectedCategoryNamesWithKeys(
                          tempCategoryFilter,
                          categoryTreeData,
                        ).length
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
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
        </div>

        {/* Status Tabs Section */}
        <div className="flex gap-2">
          {productStatusTabs.map((tab) => (
            <div
              key={tab.value}
              className={`rounded-full py-[10px] px-4 cursor-pointer ${
                filter.status === tab.value ||
                (!filter.status && tab.value === "ALL")
                  ? "bg-primary text-white"
                  : "border border-border-primary"
              }`}
              onClick={() => {
                setCurrentPage(1);
                setFilter({ ...filter, status: tab.value });
              }}
            >
              {tab.label} ({tab.count})
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl overflow-auto">
          <div className="pt-6 pb-3 px-4 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex items-center gap-6">
              <Typography
                variant="paragraph-medium"
                className="!text-text-secondary !font-semibold"
              >
                สินค้าทั้งหมด {totalItems} รายการ
              </Typography>
              <SelectField
                placeholder="ราคารวมภาษี"
                options={PRICE_DISPLAY_OPTIONS}
                value={priceDisplayMode}
                onChange={(value) => setPriceDisplayMode(value as string)}
                className="w-48"
              />
              <ToggleSwitch
                title="แสดงรายละเอียดภาษี"
                showLabel={false}
                type="text"
                isChecked={showVatDetails}
                onChange={(checked) => setShowVatDetails(checked)}
              />
            </div>

            <div className="flex gap-2">
              <CustomButton
                size="small"
                variant="outlined"
                color="primary"
                icon={<i className="ri-eye-off-line"></i>}
                disabled={selectedRowKeys.length === 0}
              >
                ซ่อนสินค้า ({selectedRowKeys.length}) รายการ
              </CustomButton>
              <CustomButton
                size="small"
                variant="outlined"
                color="primary"
                icon={<i className="ri-edit-line"></i>}
                disabled={selectedRowKeys.length === 0}
              >
                แก้ไข ({selectedRowKeys.length}) รายการ
              </CustomButton>
              <CustomButton
                size="small"
                color="error"
                icon={<i className="ri-delete-bin-6-line"></i>}
                disabled={selectedRowKeys.length === 0}
              >
                ลบ ({selectedRowKeys.length}) รายการ
              </CustomButton>
            </div>
          </div>

          <div className="mt-3">
            <CustomTable<IProductResponseMerchantProduct>
              columns={tableColumns}
              items={filteredProducts}
              loading={isLoading}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: (selectedKeys) => {
                  setSelectedRowKeys(selectedKeys);
                },
                columnWidth: 56,
                fixed: true,
              }}
              emptyText="ไม่พบสินค้า"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page, size) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                    setCurrentPage(1);
                  }
                },
                locale: {
                  items_per_page: " / หน้า",
                  prev_page: "ย้อนกลับ",
                  next_page: "หน้าถัดไป",
                },
              }}
              tableLayout="fixed"
              scroll={{ x: 1600 }}
            />
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      <ResponsivePopup
        visible={isCategoryModalOpen}
        onClose={() => {
          handleResetCategory();
          setIsCategoryModalOpen(false);
        }}
        modalTitle={<Typography variant="h4">หมวดหมู่สินค้า</Typography>}
        drawerTitle={<Typography variant="h4">หมวดหมู่สินค้า</Typography>}
        modalProps={{ width: 800 }}
      >
        <div className="flex flex-col gap-4 mt-6 max-h-[80vh]">
          <div className="flex gap-2">
            <TextField
              placeholder="ค้นหาหมวดหมู่"
              prefix={<i className="ri-search-line"></i>}
              value={searchCategoryInput}
              onChange={(e) => setSearchCategoryInput(e.target.value)}
              allowClear
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchCategory();
                }
              }}
              onClear={() => {
                setExpandedKeys([]);
                setSearchCategoryInput("");
                setSearchCategory("");
                if (treeContainerRef.current) {
                  treeContainerRef.current.scrollTop = 0;
                }
              }}
            />
            <CustomButton onClick={handleSearchCategory}>ค้นหา</CustomButton>
          </div>

          {/* Display selected categories */}
          {selectedCategoryData.length > 0 && (
            <div className="bg-surface-primary rounded-lg">
              <Typography
                variant="paragraph-medium"
                className="!text-text-tertiary mb-2"
              >
                หมวดหมู่ที่เลือก {selectedCategoryData.length} รายการ
              </Typography>
              <div className="flex flex-wrap items-start p-3 gap-2 bg-background-secondary min-h-[84px] rounded-xl">
                {selectedCategoryData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-primary-subtle border border-primary pl-3 pr-2 py-[2px] rounded-full flex items-center gap-2"
                  >
                    <Typography
                      variant="paragraph-small"
                      className="!text-primary"
                    >
                      {item.name}
                    </Typography>
                    <i
                      className="ri-close-line cursor-pointer text-primary"
                      onClick={() => {
                        // Remove all keys associated with this category
                        const newSelected = selectedCategories.filter(
                          (key) => !item.keys.includes(key),
                        );
                        setSelectedCategories(newSelected);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={treeContainerRef} className="max-h-[500px] overflow-y-auto">
            {highlightedTreeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[360px]">
                <Typography
                  variant="paragraph-medium"
                  className="text-text-secondary"
                >
                  ไม่พบหมวดหมู่สินค้า
                </Typography>
              </div>
            ) : (
              <Tree
                checkable
                selectable={false}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                checkedKeys={selectedCategories}
                onCheck={(checkedKeys) => {
                  setSelectedCategories((prev) => {
                    // Keep keys that are not visible in current filtered tree (hidden by search)
                    const hiddenKeys = prev.filter(
                      (key) => !visibleKeys.includes(key),
                    );
                    // Combine hidden keys with newly checked visible keys
                    const newChecked = Array.isArray(checkedKeys)
                      ? checkedKeys
                      : checkedKeys.checked;
                    return [...hiddenKeys, ...newChecked];
                  });
                }}
                treeData={highlightedTreeData}
                className="[&_.anticon]:!text-[#008C36]"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <CustomButton
              variant="outlined"
              color="neutral"
              onClick={() => {
                handleResetCategory();
                if (treeContainerRef.current) {
                  treeContainerRef.current.scrollTop = 0;
                }
              }}
            >
              รีเซ็ต
            </CustomButton>
            <CustomButton
              onClick={() => {
                const categoriesToFilter = [...selectedCategories];
                setExpandedKeys([]);
                setTempCategoryFilter(categoriesToFilter);
                setFilter({
                  ...filter,
                  categories: categoriesToFilter.map((key) => Number(key)),
                });
                setIsCategoryModalOpen(false);
                setSearchCategoryInput("");
                setSearchCategory("");
                setCurrentPage(1);
              }}
            >
              ตกลง
            </CustomButton>
          </div>
        </div>
      </ResponsivePopup>
    </div>
  );
}
