type DesktopFiltersProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function DesktopFilters(props: DesktopFiltersProps) {
  return (
    <>
      <div className={props.className}>{props.children}</div>
    </>
  );
}
