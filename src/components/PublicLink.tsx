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
      className="block mb-5 p-4 bg-slate-100 rounded-md text-center break-all hover:bg-slate-200"
    >
      {title}
    </a>
  );
};

export default PublicLink;
