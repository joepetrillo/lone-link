import { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Spinner from "./Spinner";
import TrashIcon from "./TrashIcon";
import HandleIcon from "./HandleIcon";

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
    transform: CSS.Transform.toString(
      transform
        ? {
            x: transform.x,
            y: transform.y,
            scaleX: 1,
            scaleY: 1,
          }
        : null
    ),
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
      className="mb-5 flex items-center justify-between gap-4 rounded-md border-2 border-slate-200 bg-slate-50 p-4 pl-2"
      ref={setNodeRef}
      style={dndStyle}
    >
      {error && <p className="mb-2 text-base text-red-500">{error}</p>}
      <div
        className="touch-none p-2"
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
      >
        <HandleIcon />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-2 truncate text-base">{title}</p>
        <a
          className="block truncate text-sm text-slate-500 underline"
          target="_blank"
          rel="noreferrer"
          href={url}
        >
          {url}
        </a>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <button
          className="rounded-md border-2 border-slate-300 bg-slate-200 p-2 text-center hover:bg-slate-300"
          onClick={handleDelete}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default DashboardLink;
