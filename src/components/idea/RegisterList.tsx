"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import { useTable, Column } from "react-table";
import Paging from "./PagingComponents";
import CustomSelectBox from "../common/CustomSelectBox";
import { useRouter } from "next/navigation";
import { Category, IdeaContentsType } from "@/model/IdeaList";

type Props = {};

interface StatusProps {
  value: string;
}

const RegisterList = (props: Props) => {
  // 선언
  const [categoryList, setCategoryData] = useState<Category[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Category>();
  const [registerList, setRegisterList] = useState<IdeaContentsType[]>([]);

  // 데이터 정렬 초기 셋팅
  const themeData: Category[] = [
    { id: "1", name: "최신순", image: "", description: "" },
    { id: "2", name: "과거순", image: "", description: "" },
    { id: "3", name: "금액순", image: "", description: "" },
  ];

  // 상태
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, registerRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?theme_id=`
          ),
        ]);

        const categoryData = await categoryRes.json();
        const registerData = await registerRes.json();

        setCategoryData(categoryData);
        setRegisterList(registerData["농업"]);
      } catch (error) {
        console.error("Error fetching registerList data:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  // 이벤트
  const handleSelectTheme = (value: Category) => {
    fetchData(value);
  };
  const fetchData = async (value: Category) => {
    try {
      // 선택된 산업 로딩
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?theme_id=${value.id}`
      );
      const resData2 = await response.json();
      setRegisterList(resData2[value.name]);
    } catch (error) {
      console.error("Error fetching registerList data:", error);
    } finally {
    }
  };

  // 테이블 관련 함수
  const data = React.useMemo(() => registerList || [], [registerList]);
  const columns: Column<IdeaContentsType>[] = React.useMemo(
    () => [
      {
        Header: "No",
        width: "3%",
        Cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        Header: "",
        accessor: "id",
        width: "0%",
        Cell: () => null,
      },
      {
        Header: "아이디어명",
        accessor: "title",
        width: "20%",
      },
      {
        Header: "산업군",
        accessor: (row) => row.theme?.name || "N/A",
        width: "8%",
      },
      {
        Header: "아이디어 설명요약",
        accessor: "content",
        width: "40%",
        id: "idea_summery",
        Cell: ({ cell: { value } }) => <span>{stripHtmlTags(value)}</span>,
      },
      {
        Header: "투자 상황",
        accessor: "investment_goal",
        width: "15%",
        Cell: ({ row }) => {
          const investments = row.original.investments || [];
          const totalInvestment =
            row.original.investments?.reduce(
              (sum, investment) => sum + investment.amount,
              0
            ) || 0;
          const investmentCount = investments.length;
          return (
            <>
              {investmentCount}명/{totalInvestment.toLocaleString()}원 확보
            </>
          );
        },
      },
      {
        Header: "등록일",
        accessor: "close_date",
        width: "15%",
        Cell: ({ cell: { value } }) => <span>{formatDate(value)}</span>,
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
    useTable<IdeaContentsType>({ columns, data });
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

  // 기타 함수
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 정규식을 사용하여 태그 제거
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // "T"를 기준으로 문자열을 분리하여 날짜 부분만 반환
  };

  // 라우터
  const router = useRouter();
  const moveMain = (path: string) => {
    router.push(`/idea/register?id=${path}`); // 수정가능한 페이지로 이동
    //router.push(`./ideaContents?id=${path}`); // 등록된 페이지로 이동
  };

  return (
    <div>
      <div className={styled.mainContainer}>
        <div className={styled.headerWrap}>
          <div className={styled.titleWrap}>
            <div className={styled.title}>내 아이디어 관리</div>
            <div className={styled.desc}>
              내 아이디어 관리는 예비창업자분이 업로드한 아이디어 리스트를
              확인할 수 있는 영역입니다. <br />본 페이지를 통해 투자 라운드
              결과를 확인하실 수 있습니다.
            </div>
          </div>
        </div>

        <div className={styled.listContainer}>
          <div className={styled.searchContainer}>
            <div className={styled.selectBoxTitle}>데이터 정렬</div>
            <div className={styled.selectBox}>
              <CustomSelectBox
                options={themeData}
                value={selectedTheme}
                placeholder={themeData[0].name}
                onSelect={handleSelectTheme}
              />
            </div>
            <div className={styled.selectBoxTitle}>산업별</div>
            <div className={styled.selectBox}>
              <CustomSelectBox
                options={categoryList}
                value={selectedTheme}
                placeholder={categoryList[0] ? categoryList[0].name : "선택"}
                onSelect={handleSelectTheme}
              />
            </div>
            <div className={styled.searchWrap}>
              <input type="text" placeholder="아이디어 찾기" />
              <div className={styled.iconSearch}></div>
            </div>
          </div>

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
            {
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
                          onClick={() => moveMain(`${row.original.id}`)}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            }
          </table>
        </div>
      </div>

      <Paging page={1} count={10} setPage={0} />
    </div>
  );
};

export default RegisterList;
