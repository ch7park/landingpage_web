import { LeadsClient } from "./LeadsClient";

interface LeadsPageProps {
  params: Promise<{ token: string }>;
}

export default async function LeadsPage({ params }: LeadsPageProps) {
  const { token } = await params;
  return <LeadsClient token={token} />;
}
