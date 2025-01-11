import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
// import ReactQuill from "react-quill-new"; //import1
import dynamic from "next/dynamic";

// ReactQuill을 SSR에서 제외하고 동적 로딩
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import "react-quill-new/dist/quill.snow.css"; //import2

interface Props {
  content?: string;
  showType: string;
}

const TextEditor = forwardRef<any, Props>(({ content, showType }, ref) => {
  const quillRef = useRef<any>(null);

  // 상위 컴포넌트에서 사용할 메서드 노출
  useImperativeHandle(ref, () => ({
    getHTML: () => {
      return quillRef.current
        ? quillRef.current.getEditor().root.innerHTML
        : "";
    },
    setHTML: (html: string) => {
      if (quillRef.current) {
        quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(html);
      }
    },
  }));

  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["scrollSync"],
  ];

  const handleSaveContent = () => {
    if (quillRef.current) {
      const contentHTML = quillRef.current.getEditor().root.innerHTML;
      //setSavedContent(contentHTML); // 에디터의 내용을 상태에 저장
      console.log("저장된 내용:", contentHTML);
    }
  };

  return (
    <>
      {showType == "editor" && (
        <ReactQuill
          placeholder="내용을 입력해주세요"
          theme="snow"
          value={content}
          style={{ height: "600px" }}
        />
      )}
      {showType == "viewer" && (
        <ReactQuill
          value={content}
          readOnly={true}
          theme="snow"
          modules={{ toolbar: false }}
          style={{
            height: "auto",
            backgroundColor: "white",
          }}
        />
      )}
    </>
  );
});
export default TextEditor;
