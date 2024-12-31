export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-[75vw] flex flex-col pl-4">{children}</div>;
}
