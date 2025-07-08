"use client";
"use no memo";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import type { Table, Column } from "@tanstack/react-table";

import "lucide-react";
import {
  Settings2,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="flex w-full items-center px-2">
      <div className="grid w-full grid-cols-12 items-center">
        <div className="col-span-8 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 rounded-md p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            iconPosition="right"
            renderIcon={(props) => <ChevronsLeft {...props} />}
          >
            <span className="sr-only">Go to first page</span>
          </Button>

          <Button
            variant="outline"
            className="size-8 rounded-md p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            iconPosition="right"
            renderIcon={(props) => <ChevronLeft {...props} />}
          >
            <span className="sr-only">Go to previous page</span>
          </Button>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>

          <Button
            variant="outline"
            className="size-8 rounded-md p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            iconPosition="right"
            renderIcon={(props) => <ChevronRight {...props} />}
          >
            <span className="sr-only">Go to next page</span>
          </Button>

          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            iconPosition="right"
            renderIcon={(props) => <ChevronsRight {...props} />}
          >
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>

        <div className="col-span-4 flex flex-col items-center justify-end space-x-2 md:flex-row">
          <p className="hidden text-sm font-medium md:inline">Rows per page</p>

          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 max-w-min rounded-md text-sm">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

interface TableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  header: string | React.ReactNode;
}

function TableColumnHeader<TData, TValue>({
  column,
  header,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{header}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2 p-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
            iconPosition="right"
            renderIcon={(props) => {
              switch (column.getIsSorted()) {
                case "asc":
                  return <ArrowUp {...props} />;

                case "desc":
                  return <ArrowDown {...props} />;

                default:
                  return <ChevronsUpDown {...props} />;
              }
            }}
          >
            <span>{header}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="text-muted-foreground/70 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="text-muted-foreground/70 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>

          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="text-muted-foreground/70 h-3.5 w-3.5" />
                Hide
              </DropdownMenuItem>{" "}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface TableViewOptionsProps<TData> {
  table: Table<TData>;
}

function TableViewOptions<TData>({ table }: TableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          renderIcon={(props) => <Settings2 {...props} />}
        >
          View
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { TableColumnHeader, TablePagination, TableViewOptions };
