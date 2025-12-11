
import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Filter,
  Download,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  CreditCard,
  Gift,
  ArrowUpRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Check,
  X,
  Search,
  MoreVertical,
  Plus,
  Landmark,
  Banknote,
  AlertCircle,
  Info,
  Wallet,
  CalendarClock,
  Globe
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";
import { Input } from "../../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar, AvatarFallback } from "../../components/ui/Avatar";
import { MOCK_GIFTS, MOCK_DONORS } from "../../lib/mock";
import { Gift as GiftType } from "../../lib/types";
import { cn } from "../../lib/utils";
import { usePagination } from "../../hooks/use-pagination";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationEllipsis
} from "../../components/ui/Pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/Tooltip";

// --- Helper Functions ---

const getDonorAvatar = (donorId: string) => {
  const donor = MOCK_DONORS.find(d => d.id === donorId);
  return donor ? donor.name.charAt(0) : '?';
};

const getDonorEmail = (donorId: string) => {
  const donor = MOCK_DONORS.find(d => d.id === donorId);
  return donor ? donor.email : '';
};

// --- Table Columns Definition ---

const columns: ColumnDef<GiftType>[] = [
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const reason = row.original.failureReason;

      if (status === 'failed') {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 pl-1.5 gap-1.5 font-medium cursor-help transition-colors h-6">
                  <XCircle className="h-3.5 w-3.5 fill-red-100 text-red-600" /> Failed
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4 bg-white border-red-100 shadow-xl" sideOffset={8}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-full shrink-0">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">Transaction Declined</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The payment processor was unable to capture funds for this donation.
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50/50 rounded-md p-2.5 border border-red-100">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Processor Message</p>
                    <p className="text-sm font-medium text-red-900">"{reason || "Unknown Error"}"</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Recommended Action:</span> Contact the donor to update their payment method or retry the transaction.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      if (status === 'pending') {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 pl-1.5 gap-1.5 font-medium cursor-help h-6">
                  <Clock className="h-3.5 w-3.5 fill-amber-100" /> Pending
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3" sideOffset={8}>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Processing</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This transaction is currently being processed by the bank. Funds typically settle within 2-3 business days.
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 pl-1.5 gap-1.5 font-medium h-6">
          <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-100" /> Succeeded
        </Badge>
      );
    },
    filterFn: (row, id, filterValues) => {
      return (filterValues as string[]).includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 h-8 data-[state=open]:bg-accent hover:bg-slate-50 font-medium text-xs text-slate-500"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("date") as string;
      const date = new Date(dateStr);
      const formatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
      return <div className="text-sm font-medium text-slate-700 whitespace-nowrap">{formatted}</div>;
    },
  },
  {
    accessorKey: "donorName",
    header: "Donor",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[200px] py-1 group cursor-pointer">
        <Avatar className="h-8 w-8 border border-slate-200 group-hover:border-slate-300 transition-colors">
          <AvatarFallback className="bg-slate-50 text-slate-600 text-[10px] font-bold group-hover:bg-slate-100">
            {getDonorAvatar(row.original.donorId)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-slate-900 truncate leading-none mb-0.5 group-hover:text-black transition-colors">
            {row.getValue("donorName")}
          </span>
          <span className="text-[11px] text-slate-500 truncate leading-none">
            {getDonorEmail(row.original.donorId)}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Details",
    cell: ({ row }) => {
      const { paymentMethod: method, paymentInstrument: instrument, paymentLabel: label, type, recurringInfo: recurring } = row.original;
      const isOnline = method === 'online';
      const isCheck = instrument === 'check';
      const isAch = instrument === 'ach';

      return (
        <div className="flex flex-col gap-2 items-start">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help group rounded-md hover:bg-slate-50 py-0.5 pr-2 transition-colors -ml-1 pl-1">
                  {instrument === 'card' && (
                    <div className="p-1 bg-slate-100 rounded text-slate-600 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                      <CreditCard className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {instrument === 'ach' && (
                    <div className="p-1 bg-slate-100 rounded text-slate-600 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                      <Landmark className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {(instrument === 'check' || instrument === 'cash') && (
                    <div className="p-1 bg-slate-100 rounded text-slate-600 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                      <Banknote className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 border-b border-dashed border-slate-300 group-hover:border-slate-400">
                    {label || (instrument === 'check' ? 'Check' : 'Card')}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] p-0 overflow-hidden shadow-xl bg-white border-slate-200" sideOffset={8}>
                <div className="bg-slate-50/80 border-b border-slate-100 p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    {isOnline ? <Globe className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                    {isOnline ? "Online Gift" : "Offline Gift"}
                  </span>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-white border-slate-200">
                    {instrument.toUpperCase()}
                  </Badge>
                </div>
                <div className="p-3 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isOnline 
                      ? (isAch 
                          ? "This online donation was processed directly from the donor's bank account (ACH transfer)." 
                          : "This online donation was processed securely via the donor's credit or debit card.")
                      : "This gift was recorded manually (offline). Typically this means a physical check or cash was given directly and then logged here."
                    }
                  </p>
                  {isCheck && (
                    <div className="flex gap-2 items-start bg-amber-50 p-2 rounded border border-amber-100">
                      <Info className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-amber-800 leading-tight">
                        Checks take longer to clear. Ensure the physical check has been deposited.
                      </p>
                    </div>
                  )}
                  {isAch && (
                    <div className="flex gap-2 items-start bg-blue-50 p-2 rounded border border-blue-100">
                      <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-blue-800 leading-tight">
                        ACH transfers have lower processing fees than cards, reducing the cost of processing this donation.
                      </p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-fit">
            {type === 'recurring' ? (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 pl-1.5 pr-2 gap-1.5 h-5 text-[10px] font-medium border hover:bg-indigo-100 hover:border-indigo-200 cursor-help transition-all">
                      <RefreshCw className="h-3 w-3" /> Recurring
                    </Badge>
                  </TooltipTrigger>
                  {recurring && (
                    <TooltipContent className="w-[240px] p-0 bg-white border-slate-200 shadow-xl" sideOffset={5}>
                      <div className="bg-indigo-50/50 border-b border-indigo-100 p-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5" /> Subscription
                        </span>
                        <Badge className="bg-white text-indigo-700 border-indigo-100 hover:bg-white text-[9px] h-4">
                          Active
                        </Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                          <span className="text-slate-500">Frequency</span>
                          <span className="text-slate-900 font-medium text-right">{recurring.frequency}</span>
                          
                          <span className="text-slate-500">Started On</span>
                          <span className="text-slate-900 font-medium text-right">{new Date(recurring.startDate).toLocaleDateString()}</span>
                          
                          <span className="text-slate-500">Next Gift</span>
                          <span className="text-slate-900 font-medium text-right">{new Date(recurring.nextPaymentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="pt-2 mt-1 border-t border-slate-100">
                          <p className="text-[10px] text-slate-400 text-center">
                            Manage this schedule in the donor's profile.
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-slate-200 pl-1.5 pr-2 gap-1.5 h-5 text-[10px] font-medium border hover:bg-slate-100 cursor-default">
                <CreditCard className="h-3 w-3" /> One-time
              </Badge>
            )}
          </div>
        </div>
      );
    },
    filterFn: () => true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          className="-mr-4 h-8 data-[state=open]:bg-accent hover:bg-slate-50 font-medium text-xs text-slate-500"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-bold text-slate-900 tabular-nums text-sm">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Donor Profile</DropdownMenuItem>
              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-slate-500 text-xs">
                ID: {row.original.id}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const WorkerGifts: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [dateRange, setDateRange] = useState<'all' | '30d' | 'ytd'>('all');

  const data = useMemo(() => {
    let filtered = MOCK_GIFTS;
    return filtered;
  }, [dateRange]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const donorName = row.original.donorName.toLowerCase();
      const donor = MOCK_DONORS.find(d => d.id === row.original.donorId);
      const donorEmail = donor ? donor.email.toLowerCase() : '';
      return donorName.includes(search) || donorEmail.includes(search);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10
      },
      sorting: [{ id: "date", desc: true }]
    }
  });

  const filteredRows = table.getFilteredRowModel().rows;

  const totalVolume = useMemo(() => {
    return filteredRows.reduce((sum, row) => {
      return row.original.status === 'succeeded' ? sum + row.original.amount : sum;
    }, 0);
  }, [filteredRows]);

  const successCount = useMemo(() => 
    filteredRows.filter(r => r.original.status === 'succeeded').length
  , [filteredRows]);

  const avgGift = useMemo(() => 
    successCount > 0 ? totalVolume / successCount : 0
  , [totalVolume, successCount]);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 3
  });

  const isFiltered = columnFilters.length > 0 || globalFilter !== '' || dateRange !== 'all';

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter('');
    setDateRange('all');
    table.resetRowSelection();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            My Gifts
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Real-time log of all donations received.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-slate-50 border-slate-200 shadow-sm text-slate-700 h-9 gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button 
            className="shadow-sm h-9 gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Add Manual Gift
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <CreditCard className="h-24 w-24 -rotate-12 text-slate-900" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalVolume)}
              </h3>
              {filteredRows.length !== MOCK_GIFTS.length && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Filtered</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <CheckCircle2 className="h-24 w-24 -rotate-12 text-green-600" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Successful Gifts</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{successCount}</h3>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <ArrowUpRight className="h-24 w-24 -rotate-12 text-blue-600" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Average Gift</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(avgGift)}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-center bg-white/50">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search donor name or email..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-slate-50 border-slate-200 focus:bg-white transition-all focus:ring-2 focus:ring-slate-100 focus:border-slate-300"
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar justify-start lg:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-9 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50", 
                    dateRange !== 'all' && "bg-slate-50 border-slate-400 text-slate-900"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {dateRange === 'all' ? 'All Time' : dateRange === '30d' ? 'Last 30 Days' : 'This Year'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => setDateRange('all')}>All Time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('30d')}>Last 30 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('ytd')}>This Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-9 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50", 
                    (table.getColumn("status")?.getFilterValue() as string[])?.length > 0 && "bg-slate-50 border-slate-400 text-slate-900"
                  )}
                >
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  Status
                  {((table.getColumn("status")?.getFilterValue() as string[])?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 rounded-[4px] px-1 font-normal bg-slate-200 text-slate-900 hover:bg-slate-300">
                      {(table.getColumn("status")?.getFilterValue() as string[]).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['succeeded', 'pending', 'failed'].map(statusOption => {
                  const current = (table.getColumn("status")?.getFilterValue() as string[]) || [];
                  const isChecked = current.includes(statusOption);
                  return (
                    <React.Fragment key={statusOption}>
                      <DropdownMenuCheckboxItem
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newValues = checked 
                            ? [...current, statusOption] 
                            : current.filter(val => val !== statusOption);
                          table.getColumn("status")?.setFilterValue(newValues.length ? newValues : undefined);
                        }}
                        className="capitalize"
                      >
                        {statusOption}
                      </DropdownMenuCheckboxItem>
                    </React.Fragment>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="h-9 px-2 lg:px-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-200">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="h-10 text-xs uppercase tracking-wider font-semibold text-slate-500">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-50/50 border-slate-100 h-16 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <Gift className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-900">No gifts found</p>
                      <p className="text-sm mt-1 max-w-xs mx-auto">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                      <Button variant="outline" className="mt-4" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0 sticky bottom-0 z-10">
          <div className="text-xs text-slate-500 pl-2 hidden sm:block">
            Showing <strong>{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</strong> to <strong>{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredRows.length)}</strong> of <strong>{filteredRows.length}</strong> gifts
          </div>
          <Pagination className="w-auto ml-auto flex items-center">
            <PaginationContent className="flex items-center gap-1">
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pages.map(pageNum => (
                <PaginationItem key={pageNum}>
                  <Button
                    variant={pageNum === table.getState().pagination.pageIndex + 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    className={cn(
                      "h-8 w-8 p-0 text-xs font-medium",
                      pageNum === table.getState().pagination.pageIndex + 1 && "shadow-sm"
                    )}
                  >
                    {pageNum}
                  </Button>
                </PaginationItem>
              ))}
              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};