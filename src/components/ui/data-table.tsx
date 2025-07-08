"use client";
"use no memo";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  type TableOptions,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { TablePagination } from "~/components/ui/data-table-elements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;

  pagination?: {
    onPaginationChange: TableOptions<TData>["onPaginationChange"];
    rowCount: number;
    paginationState: PaginationState;
  } | null;
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  pagination,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting: true,
    state: {
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  if (pagination) {
    table.setOptions((prev) => ({
      ...prev,
      getPaginationRowModel: getPaginationRowModel(),
      manualPagination: true,
      onPaginationChange: pagination.onPaginationChange,
      rowCount: pagination.rowCount,
      state: {
        ...prev.state,
        pagination: pagination.paginationState,
      },
    }));
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="bg-black-800 h-full border md:rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} data-slot="table-row">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>

          <TableBody>
            {(() => {
              switch (true) {
                case isLoading:
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <Loader2 className="mx-auto animate-spin" />
                      </TableCell>
                    </TableRow>
                  );

                case table.getRowModel().rows.length > 0:
                  return table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ));

                default:
                  return (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="pt-6 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  );
              }
            })()}
          </TableBody>
        </Table>
      </div>

      {!!pagination && <TablePagination table={table} />}
    </div>
  );
}
