import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { io } from "socket.io-client";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { DeltaStatic } from "quill";
import { useParams } from "react-router-dom";

const HOST = import.meta.env.VITE_BACKEND_HOST;
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

const toolbarOptionsSmallScreen = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  ["link"],
];

const TextEditor = ({ text, readOnly, setText }: textEditorPropInterface) => {
  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  const textEditorRef = useRef<ReactQuill>(null);
  const { id } = useParams<{ id: string }>();
  console.log(id);

  // useEffect to to attach web socket connectivity with the backend
  const [socket, setSocket] = useState<any>(); // eslint-disable-line
  useEffect(() => {
    const s = io(HOST);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // send the noteId to the backend as room-id whenever it changes
  useEffect(() => {
    if (!socket) return;
    socket.emit("get-room-id", id);
  }, [socket, id]);

  // handle editor change events to send the delta to the server so that it can be broadcasted to other users
  const handleTextChange = (content: string, delta: object, source: string) => {
    // do the operations if the source is user and setText function is being passed and socket is defined
    if (source === "user" && setText && socket) {
      // set the content text locally in the editor
      setText(content);
      // emit the DELTA to server so that peers can use it
      socket.emit("send-changes", delta, id);
    }
  };
  // useEffect to accept changes done by others
  useEffect(() => {
    if (socket) {
      socket.on("receive-changes", (delta: DeltaStatic) => {
        const editor = textEditorRef?.current?.getEditor();
        if (!editor) return;
        editor.updateContents(delta);
      });
    }
  }, [socket]);

  return (
    <>
      {readOnly && (
        <ReactQuill
          theme="snow"
          value={text}
          readOnly={readOnly}
          modules={{ toolbar: [""] }}
        />
      )}
      {!readOnly && tablet && (
        <ReactQuill
          theme="snow"
          value={text}
          readOnly={readOnly}
          ref={textEditorRef}
          onChange={handleTextChange}
          modules={{ toolbar: toolbarOptions }}
        />
      )}

      {!readOnly && !tablet && (
        <ReactQuill
          theme="snow"
          value={text}
          ref={textEditorRef}
          readOnly={readOnly}
          onChange={handleTextChange}
          modules={{ toolbar: toolbarOptionsSmallScreen }}
        />
      )}
    </>
  );
};

export default TextEditor;
