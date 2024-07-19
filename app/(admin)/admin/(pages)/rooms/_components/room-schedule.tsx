"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toLocaleDatestring } from "@/lib/changeDateTime"
import { cn } from "@/lib/utils"
import { useDeleteModal } from "@/hooks/use-delete-schedule-modal"
import { usePaymentModal } from "@/hooks/use-payment-modal"

interface scheduleProps {
  data: any[],
  user?: boolean
}

export function RoomSchedules({
  data,
  user
}: scheduleProps) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const {onOpen} = useDeleteModal()
  const {onOpenPayment} = usePaymentModal()

  // column data
  const columns: ColumnDef<any>[] = (data.length <= 0) 
    ? [] 
    : [
      {
        id: "select",
        enableSorting: false,
        enableHiding: false,
      },
      ...Object.entries(data[0]).map(([key, value]) => ({
        accessorKey: key,
        header: (key === 'referenceId' || key === 'roomReference') ? '' : key[0].toUpperCase()+key.slice(1),
        cell: ({row}: {row: any}) => 
          <div className={cn("lowercase", ((key === 'referenceId' || key === 'roomReference') && 'hidden p-0'))}>
            { key !== 'referenceId' && ((typeof value === 'number') 
            ? '₱ '+row.getValue(key) 
            : typeof value === 'string' 
            ? row.getValue(key) 
            : toLocaleDatestring(row.getValue(key)))}
          </div>
      })),
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const tableData = row.original
          if (user) return null
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Schedule Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold"
                  onClick={() => onOpenPayment({reference: tableData.referenceId, paymentDue: tableData['payment Due'], previousPayment: tableData.payment, roomReference: tableData.roomReference})}
                >
                  Add Payment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-700 hover:text-red-700 font-semibold"
                  onClick={() => onOpen({reference: tableData.referenceId, text: `${tableData.room}-${tableData.referenceCode}`, roomReference: tableData.roomReference})}
                >
                  Delete Schedule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
