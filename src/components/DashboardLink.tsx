import { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Spinner from "./Spinner";

interface DashboardLinkProps {
  id: string;
  title: string;
  url: string;
  setLinks: Dispatch<
    SetStateAction<Array<{ id: string; title: string; url: string }>>
  >;
}

const DashboardLink = ({ id, title, url, setLinks }: DashboardLinkProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: id,
    disabled: loading,
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // delete link and update list
  async function handleDelete() {
    setLoading(true);
    try {
      const response = await fetch(`/api/links`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const deletedLink = await response.json();

      if (!response.ok) {
        setError(deletedLink.error);
        return;
      }

      setError("");
      setLinks((prev) => prev.filter((link) => link.id !== deletedLink.id));
    } catch (error) {
      setError("There was an error reaching the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex justify-between items-center mb-5 bg-slate-50 border-2 border-slate-200 rounded-md p-4 pl-2 gap-4"
      ref={setNodeRef}
      style={dndStyle}
    >
      {error && <p className="text-base text-red-500 mb-2">{error}</p>}
      <div className="flex items-center gap-2">
        <div
          className="p-2 touch-none"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            className="h-6 w-6"
          >
            <path d="M10 13a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2zm-4 4a1 1 0 110-2 1 1 0 010 2zm5-9a1 1 0 11-2 0 1 1 0 012 0zM7 8a1 1 0 11-2 0 1 1 0 012 0zM6 5a1 1 0 110-2 1 1 0 010 2z"></path>
          </svg>
        </div>
        <div>
          <p className="break-all mb-2">{title}</p>
          <a
            className="underline text-slate-500 break-all text-base"
            target="_blank"
            rel="noreferrer"
            href={url}
          >
            {url}
          </a>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <button
          className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-center border-2 border-slate-300"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DashboardLink;
