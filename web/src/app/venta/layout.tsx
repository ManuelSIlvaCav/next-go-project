export default function ListingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <div className="flex flex-col sm:mx-8 lg:mx-16 xl:mx-48">
          {children}
        </div>
      </main>
    </>
  );
}
