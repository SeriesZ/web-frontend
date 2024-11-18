import { Editor } from "@toast-ui/react-editor";
import React, { useState, useRef, useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

interface Props {
  content?: string;
  editorRef: React.MutableRefObject<any>;
  onChange: () => void;
}

const ToastEditor: React.FC<Props> = ({ content, editorRef, onChange }) => {
  const [editorContent, setEditorContent] = useState(
    content || "내용을 입력해주세요."
  );

  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["scrollSync"],
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(editorContent);
    }
  }, [editorRef]);

  const handleChange = () => {
    onChange();
  };

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          placeholder="내용을 입력해주세요."
          initialEditType="wysiwyg"
          previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"} // tab, vertical
          hideModeSwitch={true}
          height="600px"
          usageStatistics={false}
          toolbarItems={toolbarItems}
          onBlur={handleChange}
        />
      )}
    </>
  );
};

export default ToastEditor;
