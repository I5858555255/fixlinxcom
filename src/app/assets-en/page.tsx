export default function AssetsRedirect() {
  return (
    <div suppressHydrationWarning>
      <meta httpEquiv="refresh" content="0; url=/manage/" />
      <p>Redirecting to <a href="/manage/">/manage/</a>...</p>
    </div>
  );
}
