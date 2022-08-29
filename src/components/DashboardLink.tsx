import { Dispatch, SetStateAction, useState } from "react";
import Spinner from "./Spinner";

interface DashboardLinkData {
  id: string;
  title: string;
  url: string;
}

interface DashboardLinkProps {
  id: string;
  title: string;
  url: string;
  setLinks: Dispatch<SetStateAction<DashboardLinkData[]>>;
}

const DashboardLink = ({ id, title, url, setLinks }: DashboardLinkProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // delete link and update list
  async function handleDelete() {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/links`, {
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

      setLinks((prev) => prev.filter((link) => link.id !== deletedLink.id));
    } catch (error) {
      setError("There was an error reaching the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-between items-center mb-5 bg-slate-100 rounded-md p-4 gap-5">
      <div>
        {error && <p className="text-base text-red-500 mb-2">{error}</p>}
        <p className="break-all mb-2">{title}</p>
        <a
          className="underline text-slate-500 overflow-ellipsis text-base"
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
          className="rounded-lg px-3 py-2 bg-gray-200 hover:bg-gray-300 text-center"
          onClick={handleDelete}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default DashboardLink;
