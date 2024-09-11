"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";

interface UploadDataProps {
  uploadData: File[];
  setUploadData: React.Dispatch<React.SetStateAction<File[]>>;
  // setReadyUpload: React.Dispatch<React.SetStateAction<boolean>>;
  extList: string[];
  limitCnt: number;
  type: string;
  id: string;
}

const FileUpload: React.FC<UploadDataProps> = ({
  uploadData,
  setUploadData,
  // setReadyUpload,
  extList,
  limitCnt,
  type,
  id,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<File[]>([]);
  const [totalFiles, setTotalFiles] = useState<File[]>([]);
  const [filesSrc, setFilesSrc] = useState<string[]>([]);
  const [filesNm, setFilesNm] = useState<string[]>([]);
  const acceptValue = extList
    ? extList.map((ext) => `${type}/${ext}`).join(", ")
    : "";

  const handleChangeFile = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let newFileLength: number;
    let selectedFiles: FileList;
    let number = totalFiles.length;

    if (e.type === "drop") {
      const dropEvent = e as React.DragEvent<HTMLDivElement>;
      newFileLength = dropEvent.dataTransfer.files.length;
      selectedFiles = dropEvent.dataTransfer.files;
    } else {
      const changeEvent = e as React.ChangeEvent<HTMLInputElement>;
      newFileLength = changeEvent.target.files?.length || 0;
      selectedFiles = changeEvent.target.files!;
    }

    const add = totalFiles.length + newFileLength;

    if (number >= limitCnt || add > limitCnt) {
      return;
    } else {
      for (let i = 0; i < newFileLength; i++) {
        const name = selectedFiles[i].name;
        const index = name.lastIndexOf(".");
        let ext = name.substring(index + 1).toLowerCase();
        const extString = extList.join(", ");

        if (acceptValue && extList.indexOf(ext) < 0) {
          alert(`파일 확장자를 확인해주세요.\n허용되는 확장자 : ${extString}`);
          continue;
        }

        const fileSize = selectedFiles[i].size;
        let size: string;

        if (fileSize > 1048576) {
          const kilobyte = fileSize / 1024;
          const megabyte = (kilobyte / 1024).toFixed(2);
          if (parseFloat(megabyte) > 20.0) {
            alert(`파일 용량을 확인해주세요.\n최대 파일 크기 : 1GB`);
            continue;
          } else {
            size = megabyte + "MB";
          }
        } else if (fileSize > 1024) {
          size = (fileSize / 1024).toFixed(2) + "KB";
        } else {
          size = fileSize.toFixed(2) + "byte";
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFiles[i]);
        reader.onload = () => {
          setFilesSrc((filesSrc) => [...filesSrc, reader.result as string]);
        };

        const newFile = selectedFiles[i];
        // newFile["no"] = number + 1 + i;

        setFilesNm((filesNm) => [...filesNm, name]);
        setFiles((files) => [...files, newFile]);
        setTotalFiles((totalFiles) => [...totalFiles, newFile]);
        setUploadData((uploadData) => [...uploadData, newFile]);
        // setReadyUpload(true);
      }
    }
  };

  const onRemove = (index: number) => {
    const target = totalFiles[index];
    setDeleteFiles((deleteFiles) => [...deleteFiles, target]);
    setTotalFiles(totalFiles.filter((file, idx) => idx !== index));
    setUploadData(uploadData.filter((file, idx) => idx !== index));
    // setFilesNm(filesNm.filter(nm => nm !== target.name));
    const cur = [...filesSrc];
    cur.splice(index, 1);
    setFilesSrc(cur);
  };

  // useEffect(() => {
  //   if (totalFiles.length < 1) {
  //     setReadyUpload(false);
  //   }
  // }, [totalFiles]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleChangeFile(e);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {uploadData?.length === 0 ? (
        <div className={`${styled.uploadWrap}`}>
          <input
            id={id}
            type="file"
            accept={acceptValue}
            onChange={(e) => handleChangeFile(e)}
            multiple
          />
          <div className={styled.uploadBox}>
            <div
              className={styled.dropZone}
              onDrop={(e) => onFileDrop(e)}
              onDragEnter={(e) => onDragEnter(e)}
              onDragOver={(e) => onDragOver(e)}
              onDragLeave={(e) => onDragLeave(e)}
            >
              <div className={styled.uploadTxt}>
                파일을 폴더에서 찾거나, 드래그 앤 드롭(Drag and Drop)으로 파일을
                업로드 해주세요.
              </div>
              <label htmlFor={id} className={styled.uploadIcon}></label>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styled.uploadWrap}`}>
          <input
            id={id}
            type="file"
            accept={acceptValue}
            onChange={(e) => handleChangeFile(e)}
            multiple
          />
          <div className={`${styled.uploadBox} ${styled.uploaded}`}>
            <div
              className={styled.dropZone}
              onDrop={(e) => onFileDrop(e)}
              onDragEnter={(e) => onDragEnter(e)}
              onDragOver={(e) => onDragOver(e)}
              onDragLeave={(e) => onDragLeave(e)}
            >
              <div className={styled.uploadList}>
                {uploadData?.length > 0 &&
                  uploadData.map((it, idx) => {
                    return (
                      <div
                        key={`${id}_${idx}`}
                        className={styled.filename}
                        onClick={() => onRemove(idx)}
                      >
                        {it.name}
                        <div
                          className={styled.delete}
                          // onClick={() => onRemove(idx)}
                        >
                          x
                        </div>
                        {/* <img src={it} alt={it} /> */}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUpload;
