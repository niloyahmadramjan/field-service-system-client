"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { useCustomerProfile } from "@/hooks/customer.hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { CustomerAddressEditor } from "@/components/dashboard/customer-address-editor";
import { AlertCircle, LoaderCircle, MapPin, RefreshCw, UserRound } from "lucide-react";
import { displayDate } from "@/lib/customer-format";

export default function CustomerProfilePage() {
  const user = useGetMe();
  const customer = useCustomerProfile();
  if (user.isPending || customer.isPending) return <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Loading your profile…</div>;
  if (user.isError || customer.isError || !user.data?.data || !customer.data?.data) return <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 p-9 text-center"><AlertCircle className="size-8 text-destructive" /><CardTitle>Profile unavailable</CardTitle><CardDescription>We couldn’t load your profile information.</CardDescription><Button variant="outline" onClick={() => { void user.refetch(); void customer.refetch(); }}><RefreshCw className="size-4" /> Try again</Button></Card>;
  const profile = user.data.data;
  const address = customer.data.data;
  const initials = profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <section className="mx-auto max-w-5xl"><div className="mb-6 flex items-start gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></div><div><h1 className="text-2xl font-bold tracking-tight">My profile</h1><p className="mt-1 text-sm text-muted-foreground">Manage your account details and service address.</p></div></div><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle>Personal information</CardTitle><CardDescription>Your customer account details</CardDescription></div><ProfileEditor profile={profile} /></CardHeader><CardContent><div className="mb-6 flex items-center gap-4"><Avatar size="lg" className="size-16"><AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.name} /><AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback></Avatar><div><p className="text-lg font-semibold">{profile.name}</p><Badge variant="secondary" className="mt-1">{profile.status}</Badge></div></div><dl className="space-y-4 border-t pt-5 text-sm"><ProfileField label="Email" value={profile.email} /><ProfileField label="Phone" value={profile.phone} /><ProfileField label="Role" value={profile.role} /><ProfileField label="Member since" value={displayDate(profile.createdAt)} /></dl></CardContent></Card><Card><CardHeader className="flex flex-row items-start justify-between gap-3"><div><CardTitle>Service address</CardTitle><CardDescription>Where your requested services should be provided</CardDescription></div><CustomerAddressEditor profile={address} /></CardHeader><CardContent><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground"><MapPin className="size-5" /></div><p className="font-medium">{address.address || "No street address added"}</p><p className="mt-1 text-sm text-muted-foreground">{[address.city, address.district].filter(Boolean).join(", ") || "No city or district added"}</p></CardContent></Card></div></section>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 sm:grid-cols-[140px_1fr]"><dt className="text-muted-foreground">{label}</dt><dd className="break-words font-medium">{value || "—"}</dd></div>;
}
