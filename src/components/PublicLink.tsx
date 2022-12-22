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
      className="block mb-5 last:mb-0 text-center rounded-md p-4 bg-slate-50 hover:bg-slate-200 border-2 border-slate-200"
    >
      {title}
    </a>
  );
};

export default PublicLink;
