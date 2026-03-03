/**
 * Sites layout — intentionally minimal.
 * The root app/layout.tsx suppresses Navbar and Footer for /sites/* via
 * the x-pathname middleware header, so this layout just passes children through.
 */
export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
