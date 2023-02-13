import { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Spinner from "./icons/Spinner";
import TrashIcon from "./icons/TrashIcon";
import HandleIcon from "./icons/HandleIcon";

interface DashboardLinkProps {
  id: string;
  title: string;
  url: string;
  setLinks: Dispatch<
    SetStateAction<Array<{ id: string; title: string; url: string }>>
  >;
  setError: Dispatch<SetStateAction<string>>;
  setDeleteLoading: Dispatch<SetStateAction<boolean>>;
  reorderLoading: boolean;
  deleteLoading: boolean;
}

const DashboardLink = ({
  id,
  title,
  url,
  setLinks,
  setError,
  setDeleteLoading,
  reorderLoading,
  deleteLoading,
}: DashboardLinkProps) => {
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
    disabled: reorderLoading || deleteLoading,
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
    setDeleteLoading(true);
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
      setDeleteLoading(false);
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="mb-5 flex items-center justify-between gap-4 rounded-md border-2 border-slate-200 bg-slate-50 p-4 pl-2"
        ref={setNodeRef}
        style={dndStyle}
      >
        <div
          className="touch-none p-2"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
        >
          <HandleIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-base">{title}</p>
          <div className="block truncate">
            <a
              className="text-sm text-slate-500 underline"
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
            className="rounded-md border-2 border-slate-300 bg-slate-200 p-2 text-center hover:bg-slate-300"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </>
  );
};

export default DashboardLink;
