"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { envelopeService } from "@/services/envelopeService";
import type { EnvelopeListItem, EnvelopeStatus, EnvelopeFilters } from "@/types/envelope";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { EnvelopeStatusBadge } from "./EnvelopeStatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, type RoleColor } from "@/types/role";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search, Plus, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown,
  MoreHorizontal, Copy, Trash2, Download, Eye, Send, ChevronLeft, ChevronRight,
  CheckSquare, FileText
} from "lucide-react";

const colHelper = createColumnHelper<EnvelopeListItem>();

const STATUS_FILTERS: { label: string; value: EnvelopeStatus | "all" }[] = [
  { label: "All",             value: "all" },
  { label: "Draft",           value: "draft" },
  { label: "Pending",         value: "pending" },
  { label: "Partial",         value: "partially_signed" },
  { label: "Completed",       value: "signed" },
  { label: "Expired",         value: "expired" },
];

function RoleAvatars({ roles }: { roles: EnvelopeListItem["roles"] }) {
  return (
    <div className="flex -space-x-1.5">
      {roles.slice(0, 4).map((role) => (
        <div
          key={role.id}
          title={`${role.name} <${role.email}>`}
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-background shrink-0"
          style={{ backgroundColor: ROLE_COLORS[role.color as RoleColor] }}
        >
          {role.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {roles.length > 4 && (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground ring-2 ring-background">
          +{roles.length - 4}
        </div>
      )}
    </div>
  );
}

function RowActionsMenu({ row }: { row: EnvelopeListItem }) {
  const qc = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => envelopeService.delete(row.id),
    onSuccess: () => { toast.success("Envelope deleted"); qc.invalidateQueries({ queryKey: ["envelopes"] }); },
  });

  const dupMutation = useMutation({
    mutationFn: () => envelopeService.duplicate(row.id),
    onSuccess: () => { toast.success("Envelope duplicated"); qc.invalidateQueries({ queryKey: ["envelopes"] }); },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            id={`envelope-actions-${row.id}`}
            aria-label="Row actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          render={
            <Link href={`/envelopes/${row.id}`}>
              <Eye className="w-3.5 h-3.5" />
              View
            </Link>
          }
          id={`view-env-${row.id}`}
        />
        <DropdownMenuItem onSelect={() => toast.info("Sending…")} id={`send-env-${row.id}`}>
          <Send className="w-3.5 h-3.5" />
          Send
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => dupMutation.mutate()} id={`dup-env-${row.id}`}>
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.info("Downloading…")} id={`dl-env-${row.id}`}>
          <Download className="w-3.5 h-3.5" />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => deleteMutation.mutate()}
          className="text-destructive focus:text-destructive"
          id={`del-env-${row.id}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EnvelopeTable() {
  const [filters, setFilters] = useState<EnvelopeFilters>({ status: "all", page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useQuery({
    queryKey: ["envelopes", filters],
    queryFn: () => envelopeService.list(filters),
    placeholderData: (prev) => prev,
  });

  const columns = useMemo(() => [
    colHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
          aria-label="Select all"
          id="select-all-checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${row.original.title}`}
          id={`select-row-${row.original.id}`}
        />
      ),
      size: 40,
    }),
    colHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate max-w-[280px]">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">
              {info.row.original.documentCount} doc{info.row.original.documentCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      ),
      size: 320,
    }),
    colHelper.accessor("status", {
      header: "Status",
      cell: (info) => <EnvelopeStatusBadge status={info.getValue()} />,
      size: 140,
    }),
    colHelper.accessor("roles", {
      header: "Signers",
      cell: (info) => <RoleAvatars roles={info.getValue()} />,
      size: 120,
      enableSorting: false,
    }),
    colHelper.accessor("updatedAt", {
      header: "Last Updated",
      cell: (info) => (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(info.getValue()), { addSuffix: true })}
        </span>
      ),
      size: 140,
    }),
    colHelper.accessor("expiryDate", {
      header: "Expires",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-xs text-muted-foreground/50">—</span>;
        const date = new Date(val);
        const isExpired = date < new Date();
        const isSoon = !isExpired && date < new Date(Date.now() + 7 * 864e5);
        return (
          <span className={cn("text-xs", isExpired ? "text-destructive" : isSoon ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground")}>
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        );
      },
      size: 120,
    }),
    colHelper.display({
      id: "actions",
      cell: ({ row }) => <RowActionsMenu row={row.original} />,
      size: 48,
    }),
  ], []);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: data?.pagination.total ?? 0,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search envelopes…"
            className="pl-8 h-8 text-xs"
            value={filters.search ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            id="envelope-search-input"
          />
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {STATUS_FILTERS.map((sf) => (
            <button
              key={sf.value}
              onClick={() => setFilters((f) => ({ ...f, status: sf.value, page: 1 }))}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                filters.status === sf.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              id={`status-filter-${sf.value}`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" className="gap-1.5" id="envelope-filter-btn">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </Button>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 ml-auto bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">{selectedCount} selected</span>
            <Separator orientation="vertical" className="h-3 mx-1" />
            <button className="text-xs text-primary hover:underline" onClick={() => toast.info("Downloading…")}>Download</button>
            <button className="text-xs text-destructive hover:underline" onClick={() => toast.error("Deleting…")}>Delete</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground transition-colors"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          header.column.getIsSorted() === "asc" ? <ArrowUp className="w-3 h-3" /> :
                          header.column.getIsSorted() === "desc" ? <ArrowDown className="w-3 h-3" /> :
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 rounded" style={{ width: j === 1 ? "200px" : "80px" }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">No envelopes found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Adjust filters or create a new one</p>
                    </div>
                    <Link
                      href="/envelopes/create"
                      className={buttonVariants({ variant: "default", size: "sm", className: "gap-1" })}
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Envelope
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/envelopes/${row.original.id}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {((filters.page! - 1) * filters.pageSize!) + 1}–{Math.min(filters.page! * filters.pageSize!, data.pagination.total)} of {data.pagination.total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon-sm"
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                id="pagination-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(data.pagination.totalPages, 7) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-medium transition-colors",
                    filters.page === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  id={`pagination-page-${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="ghost" size="icon-sm"
                disabled={filters.page === data.pagination.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                id="pagination-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
