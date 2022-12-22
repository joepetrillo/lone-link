const CardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex justify-center items-center p-4 text-lg text-slate-800">
      <div className="bg-slate-50 p-6 rounded-md w-full max-w-screen-sm border-2 border-slate-200">
        {children}
      </div>
    </div>
  );
};

export default CardLayout;
