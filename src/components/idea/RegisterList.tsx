"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import listData from "../../store/registerListSampleData.json";
import { useTable, Column } from "react-table";
type Props = {};

interface StatusProps {
  value: string;
}

const RegisterList = (props: Props) => {
  type Data = {
    id: number;
    idea_name: string;
    industry: string;
    idea_summery: string;
    invest_situ: string;
    register_dt: string;
    status: string;
  };

  const data = React.useMemo(() => listData, []);
  const columns: Column<Data>[] = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: "id",
        width: "3%",
      },
      {
        Header: "아이디어명",
        accessor: "idea_name",
        width: "10%",
      },
      {
        Header: "산업군",
        accessor: "industry",
        width: "10%",
      },
      {
        Header: "아이디어 설명요약",
        accessor: "idea_summery",
        width: "45%",
        id: "idea_summery",
      },
      {
        Header: "투자 상황",
        accessor: "invest_situ",
        width: "15%",
      },
      {
        Header: "등록일",
        accessor: "register_dt",
        width: "8%",
      },
      {
        Header: "상태",
        accessor: "status",
        width: "8%",
        id: "status",
        Cell: ({ cell: { value } }) => <StatusBox value={value} />,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<Data>({ columns, data });

  const getDynamicClassName = (value: string) => {
    if (value == "idea_summery") return styled.longText;
    else if (value == "status") return styled.statusContainer;
    else return styled.shortText;
  };

  const StatusBox: React.FC<StatusProps> = ({ value }) => {
    if (value == "진행중")
      return <div className={`${styled.status} ${styled.doing}`}>{value}</div>;
    else
      return <div className={`${styled.status} ${styled.done}`}>{value}</div>;
  };

  return (
    <div className={styled.mainContainer}>
      <div className={styled.headerWrap}>
        <div className={styled.titleWrap}>
          <div className={styled.title}>내 아이디어 관리</div>
          <div className={styled.desc}>
            내 아이디어 관리는 예비창업자분이 업로드한 아이디어 리스트를 확인할
            수 있는 영역입니다. <br />본 페이지를 통해 투자 라운드 결과를
            확인하실 수 있습니다.
          </div>
        </div>
      </div>

      <div className={styled.listContainer}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className={styled.tableTitle}
                    {...column.getHeaderProps({
                      style: { width: column.width },
                    })}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps({
                        className: getDynamicClassName(cell.column.id),
                      })}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterList;
