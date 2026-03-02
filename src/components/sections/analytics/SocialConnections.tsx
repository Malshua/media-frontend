"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdError, MdLinkOff } from "react-icons/md";
import { HiOutlineExternalLink } from "react-icons/hi";
import { motion } from "framer-motion";
import {
  useGetConnections,
  useInitiateOAuth,
  useDisconnectPlatform,
  useSelectAdAccount,
} from "@/hooks/socialHooks";
import { Modal, Button } from "@/components/elements";

interface Connection {
  platform: string;
  status: string;
  adAccountId: string | null;
  adAccountName: string | null;
  isActive: boolean;
  lastFetchedAt: string | null;
  fetchStatus: string;
  error: string | null;
  connectedAt: string;
  availableAccounts?: { id: string; name: string }[];
}

const PLATFORMS = [
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverBg: "hover:bg-blue-600",
    btnBg: "bg-blue-600",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    hoverBg: "hover:bg-pink-500",
    btnBg: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    icon: FaTiktok,
    color: "text-gray-900 dark:text-gray-100",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
    hoverBg: "hover:bg-gray-900 dark:hover:bg-gray-700",
    btnBg: "bg-gray-900 dark:bg-gray-700",
  },
];

function SocialConnections() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: connectionsData, isLoading } = useGetConnections();
  const { mutate: initiateOAuth, isPending: isConnecting } = useInitiateOAuth();
  const { mutate: disconnectPlatform } = useDisconnectPlatform();
  const { mutate: selectAccount, isPending: isSelecting } = useSelectAdAccount();

  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null);
  const [accountSelectionModal, setAccountSelectionModal] = useState<{
    open: boolean;
    platform: string;
    accounts: { id: string; name: string }[];
  }>({ open: false, platform: "", accounts: [] });

  const connections: Connection[] = useMemo(() => {
    return connectionsData?.data?.data || [];
  }, [connectionsData]);

  // Handle OAuth redirect query params
  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth_success");
    const oauthError = searchParams.get("oauth_error");
    const requiresSelection = searchParams.get("requires_selection");

    if (oauthSuccess) {
      if (requiresSelection === "true") {
        toast.info(
          `${oauthSuccess.charAt(0).toUpperCase() + oauthSuccess.slice(1)} connected! Please select an ad account.`
        );
      } else {
        toast.success(
          `${oauthSuccess.charAt(0).toUpperCase() + oauthSuccess.slice(1)} connected successfully!`
        );
      }
      // Clean URL params without page reload
      router.replace("/media/analytics", { scroll: false });
    }

    if (oauthError) {
      toast.error(`OAuth error: ${decodeURIComponent(oauthError)}`);
      router.replace("/media/analytics", { scroll: false });
    }
  }, [searchParams, router]);

  // After connections load, check if any require account selection
  useEffect(() => {
    if (connections.length > 0) {
      const pendingConnection = connections.find(
        (c) => c.status === "pending" && c.availableAccounts && c.availableAccounts.length > 0
      );
      if (pendingConnection) {
        setAccountSelectionModal({
          open: true,
          platform: pendingConnection.platform,
          accounts: pendingConnection.availableAccounts!,
        });
      }
    }
  }, [connections]);

  const getConnectionForPlatform = (platform: string): Connection | undefined => {
    return connections.find((c) => c.platform === platform);
  };

  const handleConnect = (platform: "facebook" | "instagram" | "tiktok") => {
    setConnectingPlatform(platform);
    initiateOAuth(platform, {
      onSuccess: (response) => {
        const authUrl = response?.data?.data?.authorizationUrl;
        if (authUrl) {
          // Redirect to OAuth provider
          window.location.href = authUrl;
        } else {
          toast.error("Failed to get authorization URL");
          setConnectingPlatform(null);
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to initiate connection"
        );
        setConnectingPlatform(null);
      },
    });
  };

  const handleDisconnect = (platform: string) => {
    setDisconnectingPlatform(platform);
    disconnectPlatform(platform, {
      onSuccess: () => {
        toast.success(
          `${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected`
        );
        setDisconnectingPlatform(null);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to disconnect"
        );
        setDisconnectingPlatform(null);
      },
    });
  };

  const handleSelectAccount = (accountId: string, accountName: string) => {
    selectAccount(
      {
        platform: accountSelectionModal.platform,
        accountId,
        accountName,
      },
      {
        onSuccess: () => {
          toast.success("Ad account selected successfully!");
          setAccountSelectionModal({ open: false, platform: "", accounts: [] });
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to select account"
          );
        },
      }
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Account Selection Modal */}
      <Modal
        open={accountSelectionModal.open}
        openModal={() =>
          setAccountSelectionModal({ open: false, platform: "", accounts: [] })
        }
      >
        <div>
          <h2 className="text-lg font-semibold mb-1">Select Ad Account</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Multiple ad accounts were found for your{" "}
            {accountSelectionModal.platform} account. Select the one you want to
            track:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {accountSelectionModal.accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSelectAccount(account.id, account.name)}
                disabled={isSelecting}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-accent transition-colors flex items-center justify-between disabled:opacity-50"
              >
                <div>
                  <p className="font-medium text-sm">{account.name}</p>
                  <p className="text-xs text-muted-foreground">ID: {account.id}</p>
                </div>
                <HiOutlineExternalLink className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Social Connections Section */}
      <div className="bg-card shadow-md rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Connected Social Accounts
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect your social media accounts to track campaign performance
              metrics.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border rounded-xl p-5 animate-pulse"
              >
                <div className="h-10 w-10 bg-muted rounded-full mb-3" />
                <div className="h-4 bg-muted rounded w-24 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLATFORMS.map((platform) => {
              const connection = getConnectionForPlatform(platform.key);
              const isConnected =
                connection?.status === "connected" && connection?.isActive;
              const isPending = connection?.status === "pending";
              const hasError =
                connection?.status === "error" ||
                connection?.status === "expired" ||
                connection?.status === "revoked";
              const isThisConnecting = connectingPlatform === platform.key;
              const isThisDisconnecting =
                disconnectingPlatform === platform.key;

              return (
                <motion.div
                  key={platform.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: PLATFORMS.indexOf(platform) * 0.1 }}
                  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  className={`border rounded-xl p-5 transition-colors ${
                    isConnected
                      ? `${platform.borderColor} ${platform.bgColor}`
                      : hasError
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <platform.icon
                        className={`text-2xl ${platform.color}`}
                      />
                      <span className="font-semibold text-foreground">
                        {platform.label}
                      </span>
                    </div>
                    {isConnected && (
                      <IoMdCheckmarkCircle className="text-green-500 text-lg" />
                    )}
                    {hasError && (
                      <MdError className="text-red-500 text-lg" />
                    )}
                  </div>

                  {/* Connection Details */}
                  {isConnected && connection && (
                    <div className="mb-4 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Account:</span>{" "}
                        {connection.adAccountName || "Connected"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last synced: {formatDate(connection.lastFetchedAt)}
                      </p>
                    </div>
                  )}

                  {hasError && connection && (
                    <div className="mb-4">
                      <p className="text-xs text-red-500">
                        {connection.error || `Connection ${connection.status}. Please reconnect.`}
                      </p>
                    </div>
                  )}

                  {isPending && (
                    <div className="mb-4">
                      <p className="text-xs text-amber-600">
                        Account selection required
                      </p>
                    </div>
                  )}

                  {!isConnected && !hasError && !isPending && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isConnected ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDisconnect(platform.key)}
                        disabled={isThisDisconnecting}
                        className="w-full flex items-center justify-center gap-1.5 text-sm py-2 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <MdLinkOff className="text-base" />
                        {isThisDisconnecting ? "Disconnecting..." : "Disconnect"}
                      </motion.button>
                    ) : hasError ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleConnect(platform.key)}
                        disabled={isThisConnecting || isConnecting}
                        className={`w-full text-sm py-2 px-3 rounded-lg text-white ${platform.btnBg} transition-colors disabled:opacity-50`}
                      >
                        {isThisConnecting ? "Reconnecting..." : "Reconnect"}
                      </motion.button>
                    ) : isPending ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (
                            connection?.availableAccounts &&
                            connection.availableAccounts.length > 0
                          ) {
                            setAccountSelectionModal({
                              open: true,
                              platform: platform.key,
                              accounts: connection.availableAccounts,
                            });
                          }
                        }}
                        className="w-full text-sm py-2 px-3 rounded-lg bg-amber-500 text-white transition-colors hover:bg-amber-600"
                      >
                        Select Account
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleConnect(platform.key)}
                        disabled={isThisConnecting || isConnecting}
                        className={`w-full text-sm py-2 px-3 rounded-lg text-white ${platform.btnBg} transition-colors disabled:opacity-50`}
                      >
                        {isThisConnecting ? "Connecting..." : "Connect"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default SocialConnections;
