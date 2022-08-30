interface PublicLinkProps {
  title: string;
  url: string;
}

const PublicLink = ({ title, url }: PublicLinkProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block mb-5 w-full text-center rounded-md p-4 bg-slate-50 hover:bg-slate-200 placeholder:text-slate-500 focus:bg-slate-300 border-2 border-slate-200"
    >
      {title}
    </a>
  );
};

export default PublicLink;
