import React, { Dispatch, SetStateAction } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

interface textEditorPropInterface {
  text: string;
  readOnly: boolean;
  setText?: Dispatch<SetStateAction<string>>;
}
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const TextEditor = ({ text, readOnly, setText }: textEditorPropInterface) => {
  return (
    <>
      {readOnly ? (
        <ReactQuill
          theme="snow"
          value={text}
          readOnly={readOnly}
          modules={{ toolbar: [""] }}
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={text}
          readOnly={readOnly}
          onChange={setText}
          modules={{ toolbar: toolbarOptions }}
        />
      )}
    </>
  );
};

export default TextEditor;
