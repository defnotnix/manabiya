import {
  ArrowsDownUpIcon,
  BankIcon,
  BellIcon,
  BookmarkIcon,
  BuildingIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartDonutIcon,
  ChatIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  CodeIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DownloadIcon,
  EnvelopeIcon,
  EyeIcon,
  FilesIcon,
  FolderIcon,
  GearIcon,
  HeartIcon,
  ImageIcon,
  InfoIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MathOperationsIcon,
  PackageIcon,
  PencilIcon,
  QuestionIcon,
  ReceiptIcon,
  ShieldIcon,
  ShoppingBagIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  UsersIcon,
  VideoIcon,
  XIcon,
} from "@phosphor-icons/react";
import { PropAdminNavItems } from "@settle/admin";

export const navItems: PropAdminNavItems[] = [
  // General / Home group
  {
    label: "General",
    icon: ChartDonutIcon,
    description: "Overview and general navigation",
    children: [
      { label: "Home", icon: ChartDonutIcon, value: "/admin/home" },
      { label: "Agendas", icon: ClipboardIcon, value: "/admin/agenda" },
      { label: "Calendar", icon: CalendarIcon, value: "/admin/calendar" },
      { label: "Notifications", icon: BellIcon, value: "/admin/notifications" },
      { label: "Messages", icon: EnvelopeIcon, value: "/admin/messages" },
      { label: "Tasks", icon: CheckIcon, value: "/admin/tasks" },
      { label: "Notes", icon: ClipboardIcon, value: "/admin/notes" },
      { label: "Bookmarks", icon: BookmarkIcon, value: "/admin/bookmarks" },
      { label: "Favorites", icon: StarIcon, value: "/admin/favorites" },
      { label: "Recent Activity", icon: ClockIcon, value: "/admin/activity" },
      { label: "Search", icon: MagnifyingGlassIcon, value: "/admin/search" },
      { label: "Help Center", icon: QuestionIcon, value: "/admin/help" },
      { label: "Documentation", icon: FilesIcon, value: "/admin/docs" },
      { label: "Support", icon: ChatIcon, value: "/admin/support" },
      { label: "Feedback", icon: InfoIcon, value: "/admin/feedback" },
      { label: "Settings", icon: GearIcon, value: "/admin/settings" },
      { label: "Profile", icon: UsersIcon, value: "/admin/profile" },
      { label: "Security", icon: ShieldIcon, value: "/admin/security" },
    ],
  },

  {
    divider: true,
  },

  // v.Store module
  {
    label: "v.Store",
    icon: ShoppingBagIcon,
    description: "Manage your store and ecommerce centrally.",
    color: "grape",
    children: [
      { label: "Dashboard", icon: ChartBarIcon, value: "/admin/store" },
      {
        divider: true,
      },
      {
        label: "Products",
        icon: PackageIcon,
        value: "/admin/store/products",
        children: [
          { label: "Dashboard", icon: ChartBarIcon, value: "/admin/store" },
          {
            label: "Products",
            icon: PackageIcon,
            value: "/admin/store/products",
          },

          {
            label: "Categories",
            icon: FolderIcon,
            value: "/admin/store/categories",
          },
          { label: "Brands", icon: TagIcon, value: "/admin/store/brands" },
          {
            label: "Attributes",
            icon: TagIcon,
            value: "/admin/store/attributes",
          },
          { label: "Orders", icon: FilesIcon, value: "/admin/store/orders" },
          {
            divider: true,
            dividerLabel: "Orders",
          },
          {
            label: "Order Status",
            icon: ClockIcon,
            value: "/admin/store/order-status",
          },
          {
            label: "Returns",
            icon: ArrowsDownUpIcon,
            value: "/admin/store/returns",
          },
          {
            label: "Refunds",
            icon: CurrencyDollarIcon,
            value: "/admin/store/refunds",
          },
          {
            label: "Customers",
            icon: UsersIcon,
            value: "/admin/store/customers",
          },
          {
            label: "Customer Groups",
            icon: UsersIcon,
            value: "/admin/store/customer-groups",
          },
          { label: "Reviews", icon: StarIcon, value: "/admin/store/reviews" },
          {
            label: "Wishlist",
            icon: HeartIcon,
            value: "/admin/store/wishlist",
          },
          { label: "Coupons", icon: TagIcon, value: "/admin/store/coupons" },
          {
            label: "Discounts",
            icon: TagIcon,
            value: "/admin/store/discounts",
          },
          {
            label: "Promotions",
            icon: TagIcon,
            value: "/admin/store/promotions",
          },
          {
            label: "Shipping",
            icon: TruckIcon,
            value: "/admin/store/shipping",
          },
          {
            label: "Payment Methods",
            icon: CreditCardIcon,
            value: "/admin/store/payments",
          },
          {
            label: "Tax Settings",
            icon: ReceiptIcon,
            value: "/admin/store/tax",
          },
          {
            label: "Store Settings",
            icon: GearIcon,
            value: "/admin/store/settings",
          },
        ],
      },
      {
        label: "Categories",
        icon: FolderIcon,
        value: "/admin/store/categories",
      },

      {
        divider: true,
        dividerLabel: "Just another category",
      },

      { label: "Brands", icon: TagIcon, value: "/admin/store/brands" },
      { label: "Attributes", icon: TagIcon, value: "/admin/store/attributes" },
      { label: "Orders", icon: FilesIcon, value: "/admin/store/orders" },
      {
        label: "Order Status",
        icon: ClockIcon,
        value: "/admin/store/order-status",
      },
      {
        label: "Returns",
        icon: ArrowsDownUpIcon,
        value: "/admin/store/returns",
      },
      {
        label: "Refunds",
        icon: CurrencyDollarIcon,
        value: "/admin/store/refunds",
      },
      { label: "Customers", icon: UsersIcon, value: "/admin/store/customers" },
      {
        label: "Customer Groups",
        icon: UsersIcon,
        value: "/admin/store/customer-groups",
      },
      { label: "Reviews", icon: StarIcon, value: "/admin/store/reviews" },
      { label: "Wishlist", icon: HeartIcon, value: "/admin/store/wishlist" },
      { label: "Coupons", icon: TagIcon, value: "/admin/store/coupons" },
      { label: "Discounts", icon: TagIcon, value: "/admin/store/discounts" },
      { label: "Promotions", icon: TagIcon, value: "/admin/store/promotions" },
      { label: "Shipping", icon: TruckIcon, value: "/admin/store/shipping" },
      {
        label: "Payment Methods",
        icon: CreditCardIcon,
        value: "/admin/store/payments",
      },
      { label: "Tax Settings", icon: ReceiptIcon, value: "/admin/store/tax" },
      {
        label: "Store Settings",
        icon: GearIcon,
        value: "/admin/store/settings",
      },
    ],
  },

  // v.Organization module
  {
    label: "v.Organization",
    icon: BuildingIcon,
    description: "Management portal for your organization.",
    color: "brand",
    children: [
      { label: "Dashboard", icon: ChartBarIcon, value: "/admin/org" },
      { label: "Employees", icon: UsersIcon, value: "/admin/org/employees" },
      {
        label: "Departments",
        icon: BuildingIcon,
        value: "/admin/org/departments",
      },
      { label: "Teams", icon: UsersIcon, value: "/admin/org/teams" },
      { label: "Positions", icon: TagIcon, value: "/admin/org/positions" },
      {
        label: "Roles & Permissions",
        icon: ShieldIcon,
        value: "/admin/org/roles",
      },
      { label: "Attendance", icon: ClockIcon, value: "/admin/org/attendance" },
      {
        label: "Leave Management",
        icon: CalendarIcon,
        value: "/admin/org/leave",
      },
      {
        label: "Payroll",
        icon: CurrencyDollarIcon,
        value: "/admin/org/payroll",
      },
      { label: "Benefits", icon: HeartIcon, value: "/admin/org/benefits" },
      {
        label: "Performance",
        icon: ChartBarIcon,
        value: "/admin/org/performance",
      },
      { label: "Training", icon: BookmarkIcon, value: "/admin/org/training" },
      {
        label: "Recruitment",
        icon: UsersIcon,
        value: "/admin/org/recruitment",
      },
      { label: "Onboarding", icon: CheckIcon, value: "/admin/org/onboarding" },
      { label: "Offboarding", icon: XIcon, value: "/admin/org/offboarding" },
      {
        label: "Announcements",
        icon: BellIcon,
        value: "/admin/org/announcements",
      },
      { label: "Policies", icon: FilesIcon, value: "/admin/org/policies" },
      { label: "Documents", icon: FolderIcon, value: "/admin/org/documents" },
      { label: "Org Chart", icon: BuildingIcon, value: "/admin/org/chart" },
      { label: "Settings", icon: GearIcon, value: "/admin/org/settings" },
    ],
  },

  {
    divider: true,
  },

  // v.Accounting module
  {
    label: "v.Accounting",
    icon: MathOperationsIcon,
    description: "Full fledge accounting software for your Organization.",
    color: "teal",
    children: [
      { label: "Dashboard", icon: ChartBarIcon, value: "/admin/accounting" },
      {
        label: "Chart of Accounts",
        icon: FilesIcon,
        value: "/admin/accounting/coa",
      },
      {
        label: "General Ledger",
        icon: FilesIcon,
        value: "/admin/accounting/ledger",
      },
      {
        label: "Journal Entries",
        icon: ClipboardIcon,
        value: "/admin/accounting/journal",
      },
      {
        label: "Accounts Receivable",
        icon: CurrencyDollarIcon,
        value: "/admin/accounting/ar",
      },
      {
        label: "Accounts Payable",
        icon: CurrencyDollarIcon,
        value: "/admin/accounting/ap",
      },
      {
        label: "Invoices",
        icon: ReceiptIcon,
        value: "/admin/accounting/invoices",
      },
      { label: "Bills", icon: ReceiptIcon, value: "/admin/accounting/bills" },
      {
        label: "Payments",
        icon: CreditCardIcon,
        value: "/admin/accounting/payments",
      },
      {
        label: "Receipts",
        icon: ReceiptIcon,
        value: "/admin/accounting/receipts",
      },
      {
        label: "Bank Accounts",
        icon: BankIcon,
        value: "/admin/accounting/bank",
      },
      {
        label: "Reconciliation",
        icon: CheckIcon,
        value: "/admin/accounting/reconciliation",
      },
      {
        label: "Fixed Assets",
        icon: BuildingIcon,
        value: "/admin/accounting/assets",
      },
      {
        label: "Depreciation",
        icon: ArrowsDownUpIcon,
        value: "/admin/accounting/depreciation",
      },
      {
        label: "Budget",
        icon: ChartBarIcon,
        value: "/admin/accounting/budget",
      },
      {
        label: "Tax Management",
        icon: ReceiptIcon,
        value: "/admin/accounting/tax",
      },
      {
        label: "Financial Reports",
        icon: ChartDonutIcon,
        value: "/admin/accounting/reports",
      },
      { label: "Audit Trail", icon: EyeIcon, value: "/admin/accounting/audit" },
      {
        label: "Currency Settings",
        icon: CurrencyDollarIcon,
        value: "/admin/accounting/currency",
      },
      {
        label: "Settings",
        icon: GearIcon,
        value: "/admin/accounting/settings",
      },
    ],
  },

  // v.Inventory module
  {
    label: "v.Inventory",
    icon: PackageIcon,
    description: "Manage your inventory & stock centrally.",
    color: "orange",
    children: [
      { label: "Dashboard", icon: ChartBarIcon, value: "/admin/inventory" },
      {
        label: "Products",
        icon: PackageIcon,
        value: "/admin/inventory/products",
      },
      {
        label: "Stock Levels",
        icon: ChartBarIcon,
        value: "/admin/inventory/stock",
      },
      {
        label: "Stock Movements",
        icon: ArrowsDownUpIcon,
        value: "/admin/inventory/movements",
      },
      {
        label: "Stock Adjustments",
        icon: PencilIcon,
        value: "/admin/inventory/adjustments",
      },
      {
        label: "Stock Transfers",
        icon: TruckIcon,
        value: "/admin/inventory/transfers",
      },
      {
        label: "Warehouses",
        icon: BuildingIcon,
        value: "/admin/inventory/warehouses",
      },
      {
        label: "Locations",
        icon: MapPinIcon,
        value: "/admin/inventory/locations",
      },
      {
        label: "Bins & Shelves",
        icon: FolderIcon,
        value: "/admin/inventory/bins",
      },
      {
        label: "Purchase Orders",
        icon: FilesIcon,
        value: "/admin/inventory/purchase-orders",
      },
      {
        label: "Suppliers",
        icon: UsersIcon,
        value: "/admin/inventory/suppliers",
      },
      {
        label: "Receiving",
        icon: DownloadIcon,
        value: "/admin/inventory/receiving",
      },
      {
        label: "Shipping",
        icon: TruckIcon,
        value: "/admin/inventory/shipping",
      },
      {
        label: "Picking Lists",
        icon: ClipboardIcon,
        value: "/admin/inventory/picking",
      },
      {
        label: "Packing Slips",
        icon: FilesIcon,
        value: "/admin/inventory/packing",
      },
      { label: "Barcodes", icon: TagIcon, value: "/admin/inventory/barcodes" },
      {
        label: "Batch Tracking",
        icon: TagIcon,
        value: "/admin/inventory/batch",
      },
      {
        label: "Serial Numbers",
        icon: TagIcon,
        value: "/admin/inventory/serial",
      },
      {
        label: "Reports",
        icon: ChartDonutIcon,
        value: "/admin/inventory/reports",
      },
      { label: "Settings", icon: GearIcon, value: "/admin/inventory/settings" },
    ],
  },

  // v.CMS module
  {
    label: "v.CMS",
    icon: FilesIcon,
    description: "Manage your Sites & Content centrally.",
    color: "blue",
    children: [
      { label: "Dashboard", icon: ChartBarIcon, value: "/admin/cms" },
      { label: "Pages", icon: FilesIcon, value: "/admin/cms/pages" },
      { label: "Posts", icon: ClipboardIcon, value: "/admin/cms/posts" },
      { label: "Categories", icon: FolderIcon, value: "/admin/cms/categories" },
      { label: "Tags", icon: TagIcon, value: "/admin/cms/tags" },
      { label: "Authors", icon: UsersIcon, value: "/admin/cms/authors" },
      { label: "Comments", icon: ChatIcon, value: "/admin/cms/comments" },
      { label: "Media Library", icon: ImageIcon, value: "/admin/cms/media" },
      { label: "Files", icon: FolderIcon, value: "/admin/cms/files" },
      { label: "Galleries", icon: ImageIcon, value: "/admin/cms/galleries" },
      { label: "Videos", icon: VideoIcon, value: "/admin/cms/videos" },
      { label: "Menus", icon: FilesIcon, value: "/admin/cms/menus" },
      { label: "Widgets", icon: CodeIcon, value: "/admin/cms/widgets" },
      { label: "Templates", icon: FilesIcon, value: "/admin/cms/templates" },
      { label: "Themes", icon: ImageIcon, value: "/admin/cms/themes" },
      {
        label: "SEO Settings",
        icon: MagnifyingGlassIcon,
        value: "/admin/cms/seo",
      },
      { label: "Redirects", icon: LinkIcon, value: "/admin/cms/redirects" },
      { label: "Forms", icon: ClipboardIcon, value: "/admin/cms/forms" },
      {
        label: "Subscribers",
        icon: EnvelopeIcon,
        value: "/admin/cms/subscribers",
      },
      { label: "Settings", icon: GearIcon, value: "/admin/cms/settings" },
    ],
  },
];
