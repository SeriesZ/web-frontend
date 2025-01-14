import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./TextEditorStyle.css";

interface Props {
  content?: string;
  showType: string;
  onChangeContent?: (content: string) => void;
}

// ReactQuill을 SSR에서 제외하고 동적 로딩
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const TextEditor = forwardRef<any, Props>(
  ({ content, showType, onChangeContent }, ref) => {
    const quillRef = useRef<any>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    // 상위 컴포넌트에서 사용할 메서드 노출
    useImperativeHandle(ref, () => ({
      getHTML: () => {
        return quillRef.current ? quillRef.current.getHTML() : "";
      },
      setHTML: (html: string) => {
        if (quillRef.current) {
          quillRef.current.getHTML();
        }
      },
    }));

    // 에디터 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          editorContainerRef.current &&
          !editorContainerRef.current.contains(event.target as Node)
        ) {
          if (quillRef.current) {
            const htmlContent = quillRef.current.getHTML();
            if (onChangeContent) {
              onChangeContent(htmlContent);
            }
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toolbarItems = [
      ["heading", "bold", "italic", "strike"],
      ["hr"],
      ["ul", "ol", "task"],
      ["table", "link"],
      ["image"],
      ["scrollSync"],
    ];

    return (
      <>
        {showType === "editor" && (
          <div ref={editorContainerRef}>
            <ReactQuill
              className="editor"
              placeholder="내용을 입력해주세요"
              theme="snow"
              value={content}
              style={{ height: "600px" }}
              onChangeSelection={(range, source, editor) => {
                if (range === null) {
                  const htmlContent = quillRef.current.getHTML();
                  if (onChangeContent) {
                    onChangeContent(htmlContent); // 상태 업데이트
                  }
                } else if (range && quillRef.current === null) {
                  quillRef.current = editor;
                }
              }}
            />
          </div>
        )}
        {showType == "viewer" && (
          <ReactQuill
            className="viewer"
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
  }
);
export default TextEditor;
