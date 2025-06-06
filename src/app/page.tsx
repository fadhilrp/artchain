"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { useEffect } from "react";

export default function Home() {
  const account = useActiveAccount(); // activeAccount has .address

  useEffect(() => {
    if (account?.address) {
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account.address }),
      });
    }
  }, [account]);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
        </div>
      </div>
    </main>
  );
}
