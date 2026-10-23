"use client";

import { useState } from "react";
import {
  Search,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RequestTable from "@/components/admin/requests/request-table";

// Replace with your actual table component.
// import RequestTable from "@/components/admin/requests/request-table";

export type RequestStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const requestTabs = [
  { value: "ALL", label: "All Requests", icon: ClipboardList },
  { value: "PENDING", label: "Pending", icon: Clock3 },
  { value: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected", icon: XCircle },
] as const;

export default function RequestService() {
  const [activeTab, setActiveTab] = useState<RequestStatus>("ALL");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());

  };

  const handleReset = () => {
    setSearch("");
    setSubmittedSearch("");

  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as RequestStatus);

  };

  const currentTab = requestTabs.find((tab) => tab.value === activeTab) ?? requestTabs[0];

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Service Requests
          </h1>
          <Badge variant="secondary">Admin</Badge>
        </div>

        <p className="text-sm text-muted-foreground sm:text-base">
          Manage, review, and track customer service requests.
        </p>
      </div>

      {/* Full-width request management */}
      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6">
          <CardTitle>Request Management</CardTitle>
          <CardDescription>
            Search requests and filter them by status.
          </CardDescription>
        </CardHeader>

        <CardContent className="min-w-0 p-4 sm:p-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full min-w-0"
          >
            {/* Search left, tabs right */}
            <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <form
                onSubmit={handleSearch}
                className="flex w-full min-w-0 flex-col gap-2 sm:flex-row xl:max-w-md"
              >
                <div className="relative min-w-0 flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search requests..."
                    aria-label="Search service requests"
                    className="h-10 w-full pl-9"
                  />
                </div>

                <Button type="submit" className="h-10 shrink-0">
                  Search
                </Button>

                {(search || submittedSearch) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 shrink-0"
                    onClick={handleReset}
                    aria-label="Clear search"
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                )}
              </form>

              <div className="w-full min-w-0 overflow-x-auto pb-1 xl:w-auto">
                <TabsList className="inline-flex h-10 min-w-full justify-start xl:min-w-0">
                  {requestTabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"
                      >
                        <Icon className="size-4" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            {/* Full-width table area */}
            <TabsContent value={currentTab.value} className="mt-6 w-full min-w-0">
              <RequestTable
                key={`${currentTab.value}-${submittedSearch}`}
                status={currentTab.value}
                search={submittedSearch}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
