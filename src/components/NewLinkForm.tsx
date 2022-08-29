import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { z } from "zod";
import Spinner from "./Spinner";

interface DashboardLinkData {
  id: string;
  title: string;
  url: string;
}

interface NewLinkFormProps {
  linkCount: number;
  setError: Dispatch<SetStateAction<string>>;
  setLinks: Dispatch<SetStateAction<DashboardLinkData[]>>;
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

const NewLinkForm = ({ linkCount, setError, setLinks }: NewLinkFormProps) => {
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
      const response = await fetch(`http://localhost:3000/api/links`, {
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
      <div className="flex justify-between items-center mb-5">
        <span>{`${linkCount}/5 Links`}</span>
        <button
          className={`rounded-lg px-3 py-2 text-center ${
            showForm
              ? "bg-red-300 hover:bg-red-400"
              : "bg-green-300 hover:bg-green-400"
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Link"}
        </button>
      </div>
      {showForm && (
        <fieldset disabled={loading}>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span>Title</span>
                {titleError && (
                  <span className="text-red-500 text-base">{titleError}</span>
                )}
              </div>
              <input
                className="w-full rounded-md p-2 bg-gray-200 hover:bg-gray-300"
                type="text"
                placeholder="Personal Website"
                onChange={(e) => setTitle(e.currentTarget.value)}
                value={title}
              />
            </div>
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span>URL</span>
                {urlError && (
                  <span className="text-red-500 text-base">{urlError}</span>
                )}
              </div>
              <input
                className="w-full rounded-md p-2 bg-gray-200 hover:bg-gray-300"
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
              <button className="w-full rounded-lg px-3 py-2 bg-green-300 hover:bg-green-400 text-center">
                Submit
              </button>
            )}
          </form>
        </fieldset>
      )}
    </div>
  );
};

export default NewLinkForm;
