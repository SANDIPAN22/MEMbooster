import useWithTokenAxiosInstance from "../shared/useWithTokenAxiosInstance";

interface PostNoteProps {
  body: {
    title: string;
    tags: string[];
    markdown: string;
  };
}

interface UpdateNoteProps {
  params: {
    noteId: string;
  };
  body: {
    title?: string;
    tags?: string[];
    markdown?: string;
  };
}

interface DeleteNoteProps {
  params: {
    noteId: string;
  };
}

interface GetNoteProps {
  params: {
    noteId: string;
  };
}

interface CollaboratorProps {
  params: {
    noteId: string;
  };
  body: {
    email: string;
  };
}

const useNoteServices = () => {
  const API = useWithTokenAxiosInstance(); // custom axios instance with interceptors added
  const getNotes = async () => {
    try {
      const response = await API.get("/api/note");

      return response.data;
    } catch (err) {
      console.error("Error at getNotes::", err);
      throw err;
    }
  };

  const postNote = async (payload: PostNoteProps) => {
    try {
      console.log(JSON.stringify(payload));
      const response = await API.post("/api/note", payload.body);

      return response.data;
    } catch (err) {
      console.error("Error at postNote::", err);
      throw err;
    }
  };

  const updateNote = async (payload: UpdateNoteProps) => {
    console.log("sending bodyy", payload.body);
    try {
      const response = await API.put(
        `/api/note/${payload.params.noteId}`,
        payload.body,
      );

      return response.data;
    } catch (err) {
      console.error("Error at updateNote::", err);
      throw err;
    }
  };

  const deleteNote = async (payload: DeleteNoteProps) => {
    try {
      const response = await API.delete(`/api/note/${payload.params.noteId}`);

      return response.data;
    } catch (err) {
      console.error("Error at deleteNote::", err);
      throw err;
    }
  };

  const getNote = async (payload: GetNoteProps) => {
    try {
      const response = await API.get(`/api/note/${payload.params.noteId}`);
      console.log("GOT a note", response.data);
      return response.data;
    } catch (err) {
      console.error("Error at getNote::", err);
      throw err;
    }
  };

  const addCollaborator = async (payload: CollaboratorProps) => {
    try {
      const resp = await API.put(
        `/api/note/add/collab/${payload.params.noteId}`,
        payload.body,
      );
      return resp.data;
    } catch (err) {
      console.error("Error at addCollaborator::", err);
      throw err;
    }
  };

  const deleteCollaborator = async (payload: CollaboratorProps) => {
    try {
      const resp = await API.put(
        `/api/note/delete/collab/${payload.params.noteId}`,
        payload.body,
      );
      return resp.data;
    } catch (err) {
      console.error("Error at deleteCollaborator::", err);
      throw err;
    }
  };

  const updateNoteAsCollaborator = async (payload: UpdateNoteProps) => {
    try {
      const response = await API.put(
        `/api/note/my/collab/${payload.params.noteId}`,
        payload.body,
      );

      return response.data;
    } catch (err) {
      console.error("Error at updateNote::", err);
      throw err;
    }
  };
  const getAllNotesAsCollaborator = async () => {
    try {
      const response = await API.get("/api/note/my/collab");

      return response.data;
    } catch (err) {
      console.error("Error at getNotes::", err);
      throw err;
    }
  };

  const getNoteAsCollaborator = async (payload: GetNoteProps) => {
    try {
      const response = await API.get(
        `/api/note/my/collab/${payload.params.noteId}`,
      );
      console.log("GOT a note", response.data);
      return response.data;
    } catch (err) {
      console.error("Error at getNote::", err);
      throw err;
    }
  };

  return {
    getNotes,
    deleteNote,
    updateNote,
    postNote,
    getNote,
    addCollaborator,
    deleteCollaborator,
    updateNoteAsCollaborator,
    getAllNotesAsCollaborator,
    getNoteAsCollaborator,
  };
};

export default useNoteServices;
