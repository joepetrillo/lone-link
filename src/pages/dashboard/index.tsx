import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import DashboardLink from "../../components/DashboardLink";
import Image from "next/image";
import Link from "next/link";
import NewLinkForm from "../../components/NewLinkForm";
import Spinner from "../../components/icons/Spinner";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface DashboardLinkData {
  id: string;
  title: string;
  url: string;
}

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [links, setLinks] = useState<DashboardLinkData[]>([]);

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;

    if (over !== null && active.id !== over.id) {
      let oldIndex = -1;
      let newIndex = -1;

      setLinks((links) => {
        oldIndex = links.findIndex((link) => link.id === active.id);
        newIndex = links.findIndex((link) => link.id === over.id);
        return arrayMove(links, oldIndex, newIndex);
      });

      if (oldIndex !== -1 && newIndex !== -1) {
        setReorderLoading(true);
        try {
          const response = await fetch(`/api/links`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order: arrayMove(links, oldIndex, newIndex).map(
                (link) => link.id
              ),
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.error);
            return;
          }

          setError("");
        } catch (error) {
          setError("There was an error reaching the server");
        } finally {
          setReorderLoading(false);
        }
      }
    }
  }

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const response = await fetch(`/api/links`);
        const allLinks = await response.json();

        if (!response.ok) {
          setError(allLinks.error);
          return;
        }

        setLinks(allLinks);
      } catch (error) {
        setError("There was an error reaching the server");
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  return (
    <div className="mx-auto mt-20 mb-20 max-w-screen-md px-4 text-lg text-slate-800">
      <div className="mb-10 flex items-center justify-between gap-2 border-b-2 border-slate-300 pb-10">
        <div className="flex min-w-0 items-center justify-start gap-2">
          <div className="shrink-0">
            <Image
              width={60}
              height={60}
              src={session?.user?.image as string}
              alt="profile picture"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate">@{session?.user?.name}</span>
            <a
              href={`/${session?.user?.name}`}
              target="_blank"
              className="truncate text-slate-500 underline"
              rel="noreferrer"
            >{`lone.link/${session?.user?.name}`}</a>
          </div>
        </div>
        <Link
          href="/auth/signout"
          className="shrink-0 rounded-md border-2 border-slate-300 bg-slate-200 px-3 py-2 text-center hover:bg-slate-300"
        >
          Sign Out
        </Link>
      </div>
      <main>
        {error && <p className="mb-5 text-base text-red-500">{error}</p>}
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <NewLinkForm
              setError={setError}
              setLinks={setLinks}
              linkCount={links.length}
              reorderLoading={reorderLoading}
            />
            {!links.length ? (
              <p className="text-center">You have no links</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={links}
                  strategy={verticalListSortingStrategy}
                >
                  {links.map(({ id, title, url }) => (
                    <DashboardLink
                      key={id}
                      id={id}
                      title={title}
                      url={url}
                      setLinks={setLinks}
                      setError={setError}
                      setDeleteLoading={setDeleteLoading}
                      reorderLoading={reorderLoading}
                      deleteLoading={deleteLoading}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    nextAuthOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (session?.user?.name === null || session?.user?.name === "") {
    return {
      redirect: {
        destination: "/auth/setup-profile",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};

export default Dashboard;
