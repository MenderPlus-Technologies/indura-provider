import { Card } from "@/components/ui/card";
import { useGetProviderWalletBalanceQuery } from "@/app/store/apiSlice";

export const WalletSummary = () => {
  const {
    data: walletBalance,
    isLoading,
    isError,
  } = useGetProviderWalletBalanceQuery();

  const currency = walletBalance?.currency || "NGN";
  const available = walletBalance?.availableBalance ?? 0;
  const pending = walletBalance?.pendingBalance ?? 0;
  const total = available + pending;

  const formatAmount = (amount: number) =>
    `${currency} ${amount.toLocaleString()}`;

  return (
    <div className="w-full mb-4 sm:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Total wallet (available + pending)
          </span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            {isLoading ? "Loading..." : formatAmount(total)}
          </span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Available balance
          </span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            {isLoading ? "Loading..." : formatAmount(available)}
          </span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Pending balance
          </span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">
            {isLoading ? "Loading..." : formatAmount(pending)}
          </span>
          {isError && (
            <span className="text-[11px] text-destructive">
              Failed to load wallet balance.
            </span>
          )}
        </Card>
      </div>
    </div>
  );
};

