"use client";

import React, { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination } from ".";
import { Checkbox } from "@material-tailwind/react";

const Table = ({
  columns,
  data,
  currentPage,
  setCurrentPage,
  totalPage,
  count,
  top,
  isCheckboxed,
  rowSelection,
  setRowSelection,
}: any) => {
  const columnsWithCheckbox = [
    {
      id: "select",
      header: ({ table }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: table?.getIsAllRowsSelected(),
            indeterminate: table?.getIsSomeRowsSelected(),
            onChange: table?.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    },
    ...columns,
  ];

  const table = useReactTable({
    data,
    columns: isCheckboxed ? columnsWithCheckbox : columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <div className="w-full bg-white">
      {/* pagination */}

      {top && (
        <div className="bg-white w-full pb-6 px-6 flex items-center justify-between">
          {count && (
            <div className="text-sm text-muted">
              Showing {data?.length} out of {count} results
            </div>
          )}

          {totalPage && (
            <Pagination
              totalPage={totalPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="text-white w-full">
          <thead className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="w-full border-y border-light">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left text-sm text-[#2f3742] font-bold uppercase whitespace-nowrap border-b border-gray-200 py-5 px-5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table?.getRowModel().rows.map((row) => (
              <tr key={row.id} className="relative border-y border-light">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-sm text-gray-700 font-normal capitalize whitespace-nowrap py-[14px] px-5 border-b border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {/* <div className="bg-white w-full pt-8 pb-6 px-6 flex items-center justify-between">
        {count && (
          <div className="text-sm text-muted">
            Showing {data?.length} out of {count} results
          </div>
        )}

        {totalPage && (
          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div> */}
    </div>
  );
};

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: any) => {
  const ref: any = React.useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <Checkbox ref={ref} className={className + " cursor-pointer "} {...rest} />
  );
};

export default Table;
