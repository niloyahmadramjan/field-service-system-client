"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/auth.hook";
import type { IUserProfile } from "@/types/auth.types";

export function ProfileEditor({ profile }: { profile: IUserProfile }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const updateProfile = useUpdateProfile();

  function openEditor() {
    setName(profile.name);
    setPhone(profile.phone);
    updateProfile.reset();
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile.mutateAsync({ name: name.trim(), phone: phone.trim() });
  }

  const error = updateProfile.error;
  const errorText = error instanceof Error ? error.message : "We couldn’t save your changes. Please try again.";

  return <>
    <Button variant="outline" onClick={openEditor}>Edit profile</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {updateProfile.isSuccess ? <div className="py-5 text-center"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8" /></div><DialogHeader><DialogTitle>Profile updated</DialogTitle><DialogDescription>Your account information has been saved.</DialogDescription></DialogHeader><Button className="mt-3 w-full" onClick={() => setOpen(false)}>Done</Button></div> : <>
          <DialogHeader><DialogTitle>Edit your profile</DialogTitle><DialogDescription>Update the name and phone number connected to your account.</DialogDescription></DialogHeader>
          <form onSubmit={(event) => void submit(event)} className="space-y-4">
            {updateProfile.isError && <div role="alert" className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><TriangleAlert className="size-4 shrink-0" />{errorText}</div>}
            <div className="space-y-2"><Label htmlFor="profile-name">Full name</Label><Input id="profile-name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="profile-phone">Phone number</Label><Input id="profile-phone" type="tel" autoComplete="tel" required maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={updateProfile.isPending}>Cancel</Button><Button type="submit" disabled={updateProfile.isPending}>{updateProfile.isPending && <LoaderCircle className="size-4 animate-spin" />}{updateProfile.isPending ? "Saving…" : "Save changes"}</Button></div>
          </form>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}
