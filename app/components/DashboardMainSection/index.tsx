import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CoinsIcon,
  DownloadIcon,
  FilterIcon,
  LayoutGridIcon,
  MailIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  ShoppingBagIcon,
  Table,
} from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { JSX } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IncomeChart } from "../dashboard/income-chart";

const metricCards = [
  {
    title: "Wallet Balance",
    value: "$53,765",
    change: "+10.5%",
    changeType: "success",
    icon: CoinsIcon,
    footer: "+$2,156",
    footerText: "from last month",
  },
  {
    title: "Todays Payouts",
    value: "$12,680",
    change: "+3.4%",
    changeType: "success",
    icon: BarChart3Icon,
    footer: "+$2,156",
    footerText: "from last month",
  },
  {
    title: "Pending Requests",
    value: "11,294",
    change: "-0.5%",
    changeType: "error",
    icon: ShoppingBagIcon,
    footer: "+1,450",
    footerText: "from last month",
  },
  {
    title: "Failed/Refunded",
    value: "456K",
    change: "-15.2%",
    changeType: "error",
    icon: "custom",
    footer: "-89.4K",
    footerText: "from last month",
  },
];

const tableData = [
  {
    payer: "Sharon Lehner",
    email: "Sharon.Lehner@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Bob Denesik",
    email: "Bob_Denesik@hotmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Judy Bruen",
    email: "Judy45@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "$1,100",
  },
  {
    payer: "Rafael Price",
    email: "Rafael95@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Ana Kerluke",
    email: "Ana.Kerluke50@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Eddie Kohler",
    email: "Eddie_Kohler@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Pending",
    amount: "$1,100",
  },
  {
    payer: "Henrietta Carter",
    email: "Henrietta4@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Walter Treutel",
    email: "Walter_Treutel36@gmail.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Failed",
    amount: "$1,100",
  },
  {
    payer: "Rosa Mann",
    email: "Rosa.Mann19@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
  {
    payer: "Ramon Mayert",
    email: "Ramon43@yahoo.com",
    datetime: "Dec 6, 2024  12:23:23",
    method: "Wallet",
    status: "Settled",
    amount: "$1,100",
  },
];

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-additionalsky-0 border-[#fce4dd] text-additionalorange-100";
    case "Settled":
      return "bg-alertssuccess-0 border-[#c6ede5] text-alertssuccess-100";
    case "Pending":
      return "bg-alertswarning-0 border-[#fff1db] text-alertswarning-100";
    default:
      return "";
  }
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "Failed":
      return "bg-additionalorange-100";
    case "Settled":
      return "bg-alertssuccess-100";
    case "Pending":
      return "bg-alertswarning-100";
    default:
      return "";
  }
};

export const DashboardMainSection = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full items-start bg-white relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 border-b border-solid border-[#dfe1e6] w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
          Dashboard
        </h1>

        <div className="inline-flex items-center gap-3">
          <img
            className="w-8 h-8"
            alt="Container"
            src="https://c.animaapp.com/mk5v1ugq7dubXj/img/container.svg"
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
          >
            <MailIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
          >
            <BellIcon className="h-4 w-4" />
          </Button>

          <img
            className="w-px h-[25px] object-cover"
            alt="Divider"
            src="https://c.animaapp.com/mk5v1ugq7dubXj/img/divider.svg"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto inline-flex items-center gap-2 px-2 py-1 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <div className="w-6 h-6 rounded-[999px] bg-[url(https://c.animaapp.com/mk5v1ugq7dubXj/img/image.png)] bg-cover bg-[50%_50%]" />
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="h-[72px] flex justify-between items-center px-6 py-4 border-b border-solid border-neutral-200 w-full">
        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-greyscale-25 rounded-[10px] border border-solid border-[#dfe1e6]"
        >
          <LayoutGridIcon className="h-4 w-4" />
          <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
            Overview
          </span>
        </Button>

        <div className="inline-flex items-start gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 p-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                  Monthly
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Daily</DropdownMenuItem>
              <DropdownMenuItem>Weekly</DropdownMenuItem>
              <DropdownMenuItem>Monthly</DropdownMenuItem>
              <DropdownMenuItem>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-[#009688] rounded-[10px] shadow-shadow-xsmall">
            <DownloadIcon className="h-4 w-4" />
            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-0 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
              DownloadIcon
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 p-6 w-full">
        <div className="grid grid-cols-4 gap-6 w-full">
          {metricCards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col gap-1 p-1 bg-greyscale-25 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_2px_4px_-1px_#0d0d120f]"
            >
              <CardContent className="flex items-center gap-4 p-4 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] bg-greyscale-0">
                <div className="flex flex-col items-start justify-end gap-2 flex-1">
                  <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                    {card.title}
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <div className="font-heading-h6 font-[number:var(--heading-h6-font-weight)] text-greyscale-900 text-[length:var(--heading-h6-font-size)] tracking-[var(--heading-h6-letter-spacing)] leading-[var(--heading-h6-line-height)] [font-style:var(--heading-h6-font-style)]">
                      {card.value}
                    </div>

                    <Badge
                      className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-[100px] border border-solid ${
                        card.changeType === "success"
                          ? "bg-alertssuccess-0 border-[#c6ede5]"
                          : "bg-alertserror-0 border-[#f9d2d9]"
                      }`}
                    >
                      {card.changeType === "success" ? (
                        <ArrowUpIcon className="h-4 w-4 text-alertssuccess-100" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-alertserror-100" />
                      )}
                      <span
                        className={`font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)] ${
                          card.changeType === "success"
                            ? "text-alertssuccess-100"
                            : "text-alertserror-100"
                        }`}
                      >
                        {card.change}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="flex w-10 h-10 items-center justify-center gap-2 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall">
                  {card.icon === "custom" ? (
                    <div className="w-5 h-5">
                      <img
                        className="absolute top-1 left-[3px] w-3.5 h-3"
                        alt="Icon"
                        src="https://c.animaapp.com/mk5v1ugq7dubXj/img/icon.svg"
                      />
                    </div>
                  ) : (
                    <card.icon className="h-5 w-5" />
                  )}
                </div>
              </CardContent>

              <div className="flex gap-2 px-3 py-2 w-full rounded-xl items-center">
                <div className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                  {card.footer}
                </div>

                <div className="flex-1 font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                  {card.footerText}
                </div>

                <ArrowRightIcon className="h-5 w-5" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex-1 flex flex-col gap-1 p-1 bg-greyscale-25 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
          <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden border border-solid border-[#dfe1e6] bg-greyscale-0 p-0">
            <div className="flex justify-between items-center p-4 border-b border-solid border-[#dfe1e6] w-full">
              <div className="flex flex-col items-start justify-end gap-2 flex-1">
                <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                  OVERALL INCOME
                </div>

                <div className="flex items-center gap-2 w-full">
                  <div className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
                    $83,125
                  </div>

                  <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-[100px] border border-solid bg-alertssuccess-0 border-[#c6ede5]">
                    <ArrowUpIcon className="h-4 w-4 text-alertssuccess-100" />
                    <span className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-alertssuccess-100 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                      7.7%
                    </span>
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      Monthly
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Daily</DropdownMenuItem>
                  <DropdownMenuItem>Weekly</DropdownMenuItem>
                  <DropdownMenuItem>Monthly</DropdownMenuItem>
                  <DropdownMenuItem>Yearly</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between p-4 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-4 py-2 rounded-[10px] overflow-hidden bg-greyscale-0 border border-solid border-[#dfe1e6]"
                  >
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      All Service
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Service</DropdownMenuItem>
                  <DropdownMenuItem>Service 1</DropdownMenuItem>
                  <DropdownMenuItem>Service 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="inline-flex items-baseline gap-3">
                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#009688] rounded-sm" />
                  <div className="font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] text-right tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                    This period
                  </div>
                </div>

                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-alertswarning-100 rounded-sm" />
                  <div className="font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] text-right tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                    Last period
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex flex-col items-start gap-4 p-4 w-full bg-greyscale-0 rounded-xl border border-solid border-[#dfe1e6]">
            <IncomeChart />

            <div className="flex items-center justify-between pl-[58px] pr-0 py-0 w-full">
              <div className="flex items-center justify-center font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                Dec 01, 2025
              </div>

              <div className="flex items-center justify-center font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                Dec 31, 2025
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
          <CardContent className="flex gap-4 p-4 bg-greyscale-0 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] items-center">
            <div className="flex flex-col items-start justify-end gap-2 flex-1">
              <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                RECENT ACTIVITIES
              </div>
            </div>

            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
            >
              <FilterIcon className="h-4 w-4" />
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                FilterIcon
              </span>
            </Button>
          </CardContent>

          <div className="bg-greyscale-0 rounded-xl border border-solid border-[#dfe1e6]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-solid border-[#dfe1e6]">
                  <TableHead className="w-12 h-10 px-4 py-0">
                    <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
                  </TableHead>
                  <TableHead className="w-[246px] h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Payer
                    </span>
                  </TableHead>
                  <TableHead className="w-60 h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Email Address
                    </span>
                  </TableHead>
                  <TableHead className="w-[178px] h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Time and Date
                    </span>
                  </TableHead>
                  <TableHead className="w-[114px] h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Method
                    </span>
                  </TableHead>
                  <TableHead className="flex-1 h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Status
                    </span>
                  </TableHead>
                  <TableHead className="w-[130px] h-10 px-4 py-0">
                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                      Amount
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={
                      index < tableData.length - 1
                        ? "border-b border-solid border-[#dfe1e6]"
                        : ""
                    }
                  >
                    <TableCell className="h-12 px-4 py-0">
                      <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                        {row.payer}
                      </span>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                        {row.email}
                      </span>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                        {row.datetime}
                      </span>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                        {row.method}
                      </span>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <Badge
                        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusBadgeStyles(row.status)}`}
                      >
                        <div
                          className={`w-1 h-1 rounded-sm ${getStatusDotColor(row.status)}`}
                        />
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          {row.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-0">
                      <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                        {row.amount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 w-full bg-greyscale-0 rounded-xl border border-solid border-[#dfe1e6]">
            <div className="inline-flex justify-center gap-2 items-center">
              <div className="font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] [font-style:var(--body-medium-medium-font-style)]">
                Page 1 of 34
              </div>
            </div>

            <div className="inline-flex items-start gap-[5px]">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>

              <Button className="h-8 w-8 p-2.5 bg-[#009688] rounded-lg overflow-hidden shadow-drop-shadow">
                <span className="text-greyscale-0 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
                  1
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <span className="text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
                  2
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <span className="text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
                  3
                </span>
              </Button>

              <div className="flex flex-col w-8 h-8 items-center justify-center gap-2.5 p-2.5 bg-greyscale-0 rounded-lg">
                <span className="flex items-center justify-center text-greyscale-900 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] font-body-small-medium font-[number:var(--body-small-medium-font-weight)] [font-style:var(--body-small-medium-font-style)]">
                  ...
                </span>
              </div>

              <Button
                variant="outline"
                className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <span className="text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
                  34
                </span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute left-0 bottom-0 w-full h-[73px] bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]" />
    </div>
  );
};
