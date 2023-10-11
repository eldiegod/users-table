import * as React from "react";
import { format } from "date-fns";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, ChevronDown, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, useUsersQuery } from "./use-users";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { COUNTRY_LIST, CountryCode } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function UsersTable() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedNationalities, setSelectedNationalities] = React.useState<
    CountryCode[]
  >([]);

  const usersQuery = useUsersQuery({ countryCodes: selectedNationalities });

  const table = useReactTable({
    data: usersQuery.data?.results ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Nationalities <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ScrollArea className="h-[200px]">
              {COUNTRY_LIST.map((country) => (
                <DropdownMenuCheckboxItem
                  key={country.code}
                  className="capitalize"
                  checked={selectedNationalities.includes(country.code)}
                  onCheckedChange={(value) =>
                    setSelectedNationalities((prev) =>
                      value
                        ? [...prev, country.code]
                        : prev.filter((code) => code !== country.code),
                    )
                  }
                >
                  {country.name}
                </DropdownMenuCheckboxItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {usersQuery.isLoading ? (
          <Skeleton className="h-[620px]"></Skeleton>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                          <div className="flex justify-between space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={row.original.picture.thumbnail}
                              />
                            </Avatar>
                            <div className="flex flex-col gap-2">
                              <h4 className="pb-0.5 text-sm font-semibold">
                                {row.original.name.first +
                                  " " +
                                  row.original.name.last}
                              </h4>
                              <div className="items flex">
                                <Phone className="mr-2 h-4 w-4 shrink-0 opacity-70" />{" "}
                                <span className="items flex text-xs text-muted-foreground">
                                  {row.original.phone}
                                </span>
                              </div>
                              <div className="items flex">
                                <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-70" />{" "}
                                <span className="items flex text-xs text-muted-foreground">
                                  {row.original.location.city +
                                    ", " +
                                    row.original.location.country}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                  Joined{" "}
                                  {format(
                                    new Date(row.original.registered.date),
                                    "MMMM, yyyy",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
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
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} user(s) found.
        </div>
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
      {usersQuery.error instanceof Error && (
        <div className="text-destructive">{usersQuery.error.message}</div>
      )}
    </div>
  );
}

const columnHelper = createColumnHelper<User>();

export const columns = [
  columnHelper.accessor((row) => row.name.first + " " + row.name.last, {
    id: "fullName",
    header: "Name",
    cell: (info) => {
      const name = info.getValue();
      const initials =
        (info.row.original.name.first[0] ?? "") +
        (info.row.original.name.last[0] ?? "");
      const imgUrl = info.row.original.picture.thumbnail;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={imgUrl} alt="profile pic" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {name}
        </div>
      );
    },
    enableSorting: false,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => {
      const email = info.getValue();
      return <div>{email}</div>;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => {
      const phone = info.getValue();
      return <div>{phone}</div>;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: (info) => {
      const location = info.getValue().city + ", " + info.getValue().country;
      return <div>{location}</div>;
    },
    enableSorting: false,
  }),
];
