import Header from "@/components/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Đây là phần ruột sẽ thay đổi khi bấm Menu */}
      <main className="flex-1 bg-sakura-50 pb-12 pt-6">
        {children} 
      </main>
      
      {/* Footer tạm thời */}
      <footer className="bg-gray-900 py-8 text-center text-white">
        <p>© 2026 WibuCart - Đưa thế giới 2D đến tận tay bạn.</p>
      </footer>
    </div>
  );
}