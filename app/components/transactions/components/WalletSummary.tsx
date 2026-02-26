import { Card } from "@/components/ui/card";

export const WalletSummary = () => {
  return (
    <div className="w-full mb-4 sm:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Total Wallet Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">₦2,450,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Withdrawable Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">₦1,980,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Pending Manual Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">₦320,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Pending Payment Links</span>
          <span className="text-lg sm:text-xl font-semibold text-foreground">₦150,000</span>
        </Card>
      </div>
    </div>
  );
};

