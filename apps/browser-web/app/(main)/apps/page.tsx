"use client"
import * as React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { cloudFetch } from "@/lib/api"

export default function AppsPage() {
  const [ssoToken, setSsoToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchTicket() {
      // Create a cache key tied to the current user's token (to handle account switching safely)
      const currentToken = localStorage.getItem('auth_token') || 'none';
      const cacheKey = `joii_sso_time_${currentToken.slice(-15)}`;
      const lastSsoTime = localStorage.getItem(cacheKey);
      const now = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      
      // If we performed SSO recently for this user, skip fetching the ticket
      if (lastSsoTime && now - parseInt(lastSsoTime) < TWELVE_HOURS) {
        setSsoToken(""); 
        return;
      }

      try {
        const res = await cloudFetch('/api/auth/sso-ticket');
        const data = await res.json();
        if (data.success && data.data.ticket) {
          setSsoToken(data.data.ticket);
          localStorage.setItem(cacheKey, now.toString());
        } else {
          setSsoToken("");
        }
      } catch (err) {
        setSsoToken("");
      }
    }
    fetchTicket();
  }, []);
  const iframeSrc = ssoToken ? `https://joii.cc/dashboard?sso_token=${ssoToken}` : ssoToken === "" ? "https://joii.cc/dashboard" : undefined;

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
