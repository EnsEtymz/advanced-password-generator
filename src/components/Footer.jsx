const Footer = () => {
  return (
    <footer className="w-full bg-white border-b-4 border-[#34c75a]">
      <div className="flex flex-col justify-center border-t py-12 text-sm font-medium text-muted-foreground items-center">
        <p>© {new Date().getFullYear()} PassVolt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
