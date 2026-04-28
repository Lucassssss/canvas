"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { cloudFetch } from "@/lib/api"

export default function AppsPage() {
  const [ssoToken, setSsoToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await cloudFetch('/api/auth/sso-ticket');
        const data = await res.json();
        if (data.success && data.data.ticket) {
          setSsoToken(data.data.ticket);
        } else {
          // If fetching fails or no ticket, just show without token
          setSsoToken("");
        }
      } catch (err) {
        setSsoToken("");
      }
    }
    fetchTicket();
  }, []);

  const iframeSrc = ssoToken ? `https://joii.cc/?sso_token=${ssoToken}` : ssoToken === "" ? "https://joii.cc/" : undefined;
  debugger
  return (
    <>
      <PageHeader breadcrumb={[{ label: "核心业务" }, { label: "素材中心" }]} />
      <div className="flex flex-1 p-0 overflow-hidden bg-background">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="w-full h-full border-0"
            title="Joii 素材中心"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center text-muted-foreground">
            加载中...
          </div>
        )}
      </div>
    </>
  )
}
