import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Spinner from "./icons/Spinner";
import { z } from "zod";

interface DashboardLinkData {
  id: string;
  title: string;
  url: string;
}

interface NewLinkFormProps {
  linkCount: number;
  setError: Dispatch<SetStateAction<string>>;
  setLinks: Dispatch<SetStateAction<DashboardLinkData[]>>;
  reorderLoading: boolean;
}

function validateInput(
  title: string,
  url: string,
  setTitleError: Dispatch<SetStateAction<string>>,
  setUrlError: Dispatch<SetStateAction<string>>
) {
  const validTitle = z
    .string()
    .min(1, { message: "Must be at least 1 character" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Only letters, numbers, and spaces are allowed",
    })
    .max(50, { message: "Cannot be more than 50 characters" });
  const validUrl = z.string().url({ message: "Invalid URL" });

  const titleValid = validTitle.safeParse(title);
  const urlValid = validUrl.safeParse(url);

  if (titleValid.success) setTitleError("");
  if (urlValid.success) setUrlError("");

  if (!titleValid.success && !urlValid.success) {
    setTitleError(titleValid.error.issues[0]?.message as string);
    setUrlError(urlValid.error.issues[0]?.message as string);
    return false;
  }

  if (!titleValid.success) {
    setTitleError(titleValid.error.issues[0]?.message as string);
    return false;
  }

  if (!urlValid.success) {
    setUrlError(urlValid.error.issues[0]?.message as string);
    return false;
  }

  return true;
}

const NewLinkForm = ({
  linkCount,
  setError,
  setLinks,
  reorderLoading,
}: NewLinkFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isValid = validateInput(title, url, setTitleError, setUrlError);
    if (!isValid) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          url: url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setError("");
      setLinks((old) => [...old, data]);
    } catch (error) {
      setError("There was an error reaching the server");
    } finally {
      setShowForm(!showForm);
      setTitle("");
      setUrl("");
      setLoading(false);
    }
  }

  return (
    <div className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>{`${linkCount}/5 Links`}</span>
          {reorderLoading && <Spinner small />}
        </div>
        <button
          className={`rounded-md px-3 py-2 text-center ${
            showForm
              ? "border-2 border-red-400 bg-red-300 hover:bg-red-400"
              : "border-2 border-green-400 bg-green-300 hover:bg-green-400"
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <div className="flex items-center gap-2">
              <span>New Link</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7"
              >
                <path
                  fillRule="evenodd"
                  d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>
      </div>
      {showForm && (
        <fieldset disabled={loading}>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <span>Title</span>
                {titleError && (
                  <span className="text-base text-red-500">{titleError}</span>
                )}
              </div>
              <input
                className="w-full rounded-md border-2 border-slate-300 bg-slate-200 p-3 placeholder:text-slate-500 hover:bg-slate-300 focus:bg-slate-300"
                type="text"
                placeholder="Personal Website"
                onChange={(e) => setTitle(e.currentTarget.value)}
                value={title}
              />
            </div>
            <div className="mb-10">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <span>URL</span>
                {urlError && (
                  <span className="text-base text-red-500">{urlError}</span>
                )}
              </div>
              <input
                className="w-full rounded-md border-2 border-slate-300 bg-slate-200 p-3 placeholder:text-slate-500 hover:bg-slate-300 focus:bg-slate-300"
                type="text"
                placeholder="https://jpetrillo.com/"
                onChange={(e) => setUrl(e.currentTarget.value)}
                value={url}
              />
            </div>
            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <button className="w-full rounded-md border-2 border-green-400 bg-green-300 px-3 py-2 text-center hover:bg-green-400">
                Add Link
              </button>
            )}
          </form>
        </fieldset>
      )}
    </div>
  );
};

export default NewLinkForm;
