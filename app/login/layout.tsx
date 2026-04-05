export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ background: "#c8c8c8", minHeight: "100vh" }}>
      {children}
    </div>
    )
}