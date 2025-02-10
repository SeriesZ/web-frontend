"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import { useTable, Column } from "react-table";
import Paging from "./PagingComponents";
import CustomSelectBox from "../common/CustomSelectBox";
import { useRouter } from "next/navigation";
import { Category, IdeaContentsType } from "@/model/IdeaList";
import userStore from "@/store/userLoginInfo";

type Props = {};

interface StatusProps {
  value: string;
}

const RegisterList = (props: Props) => {
  // 선언
  const [categoryList, setCategoryData] = useState<Category[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Category>();
  const [registerList, setRegisterList] = useState<IdeaContentsType[]>([]);
  const [registerAllList, setRegisterAllList] = useState<IdeaContentsType[]>(
    []
  );
  const [isDataFetched, setIsDataFetched] = useState(false); // 성공 상태 관리
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { userInfo } = userStore();

  // 데이터 정렬 초기 셋팅
  const themeData: Category[] = [
    { id: "1", name: "최신순", image: "", description: "" },
    { id: "2", name: "과거순", image: "", description: "" },
    { id: "3", name: "금액순", image: "", description: "" },
  ];

  // 상태
  useEffect(() => {
    const initFetchData = async () => {
      try {
        const [categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`),
        ]);

        const categoryData = await categoryRes.json();

        // 새로운 항목 정의
        const newTheme = {
          id: "",
          name: "전체",
          description: "",
          psr_value: 0,
        };
        categoryData.unshift(newTheme);

        setCategoryData(categoryData);
        setIsDataFetched(true); // 데이터 성공적으로 가져온 후 상태 업데이트
        setSelectedTheme(categoryData[0]);
      } catch (error) {
        console.error("Error fetching registerList data:", error);
      } finally {
      }
    };
    initFetchData();
  }, []);

  useEffect(() => {
    if (isDataFetched) {
      fetchData(categoryList[0]);
    }
  }, [isDataFetched]); // 상태 변경 시 실행

  useEffect(() => {
    if (page && registerAllList.length > 0) {
      let ideaDataList: IdeaContentsType[] = [];
      for (let i = 1; i < registerAllList.length + 1; i++) {
        var startIdx = (page - 1) * 10 + 1;
        var endIdx =
          page * 10 > registerAllList.length
            ? registerAllList.length
            : page * 10;

        if (i >= startIdx && i <= endIdx) {
          ideaDataList.push(registerAllList[i - 1]);
        }
      }
      setRegisterList(ideaDataList);
    }
  }, [page]); // 상태 변경 시 실행

  // 이벤트
  const handleSelectTheme = (value: Category) => {
    setSelectedTheme(value);
    fetchData(value);
  };
  const fetchData = async (value: Category) => {
    let fetchUrl = "";
    try {
      // 아이디어 리스트 로딩
      if (value.id) {
        fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?theme_id=${value.id}&limit=1000`;
      } else {
        fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?offset=0&limit=1000`;
      }
      const response = await fetch(fetchUrl);
      const resData2 = await response.json();

      let ideaDataList: IdeaContentsType[] = [];
      let ideaDataListAll: IdeaContentsType[] = [];
      let totalCount = 1;
      Object.keys(resData2).map((item, index) => {
        resData2[item].forEach((element: IdeaContentsType) => {
          if (element.theme.id == value.id || value.id == "") {
            totalCount++;
            ideaDataListAll.push(element);
          }
        });
      });

      // created_at 최신순으로 정렬
      ideaDataListAll.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime(); // close_date를 Date 객체로 변환
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // 최신순 정렬
      });

      ideaDataListAll.forEach((element: IdeaContentsType) => {
        if (ideaDataList.length < 10) {
          ideaDataList.push(element);
        }
      });

      setTotalCount(totalCount);
      setRegisterList(ideaDataList);
      setRegisterAllList(ideaDataListAll);
    } catch (error) {
      console.error("Error fetching registerList data:", error);
    } finally {
    }
  };

  // 아이디어 삭제
  const deleteIdeaCheck = (id: string) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      deleteIdeaFetchData(id);
      setPage(1);
    } else {
      console.log("아니오");
    }
  };
  const deleteIdeaFetchData = async (id: string) => {
    try {
      const IdeaDelUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideations/${id}`;
      const ideaResponse = await fetch(IdeaDelUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.bearer}`,
          Accept: "application/json",
        },
      });

      if (!ideaResponse.ok) {
        throw new Error("Idea URL 삭제 실패");
      }

      console.log("Idea URL 삭제 성공");
      alert("정상적으로 삭제되었습니다.");

      // 재조회
      if (selectedTheme) {
        fetchData(selectedTheme);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("정상적으로 삭제되지 않았습니다.");
    }
  };

  // 테이블 관련 함수
  const data = React.useMemo(() => registerList || [], [registerList]);
  const columns: Column<IdeaContentsType>[] = React.useMemo(
    () => [
      {
        Header: "No",
        width: "3%",
        Cell: ({ row }) => <span>{(page - 1) * 10 + row.index + 1}</span>,
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
        accessor: "created_at",
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
      {
        Header: "관리",
        width: "8%",
        id: "delete",
        Cell: ({ cell: { value } }) => (
          <button className={styled.delBtn}>삭제</button>
        ),
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
                          onClick={() =>
                            cell.column.id === "delete"
                              ? deleteIdeaCheck(`${row.original.id}`)
                              : moveMain(`${row.original.id}`)
                          }
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {/* 데이터가 부족할 경우 빈 행 추가 */}
                {rows.length < 10 &&
                  Array.from({ length: 10 - rows.length }).map((_, index) => (
                    <tr key={`empty-${index}`} className={styled.emptyRow}>
                      <td colSpan={columns.length}></td>
                    </tr>
                  ))}
              </tbody>
            }
          </table>
        </div>
      </div>

      <div>
        <Paging
          page={page}
          count={totalCount}
          setPage={setPage}
          stytleDivCd={"grid"}
        />
      </div>
    </div>
  );
};

export default RegisterList;
