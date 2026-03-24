import Dashboard from "../../components/_Dashboard/dashboard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      {children}
    </Dashboard>
  );
}