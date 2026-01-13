'use client';

import { useState } from "react";
import { DashboardScreen } from "../dashboard/dashboardScreen";
import { MembersScreen } from "../members/membersScreen";
import { TransactionsScreen } from "../transactions/transactionsScreen";
import { Header } from "./header";
import { Sidebar } from "./sidebar";


export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen />;
      case "transactions":
        return <TransactionsScreen />;
      case "members":
        return <MembersScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-white">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
