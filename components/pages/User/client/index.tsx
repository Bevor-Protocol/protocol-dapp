/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState, useTransition } from "react";
import { useAccount } from "wagmi";

import { Icon } from "@/components/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Loader";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Pencil } from "@/assets";
import { updateProfile } from "@/lib/actions/users";
import { Button } from "@/components/Button";

export const UserProfileData = ({ user }: { user: UserProfile }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader className="h-12" />;
  }

  const handleEdit = (): void => {
    if (isEditing) {
      const formEl = document.getElementById("profile") as HTMLFormElement;
      formEl.reset();
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("available", formData.has("available") ? "true" : "false");
    startTransition(async () => {
      await updateProfile(user.id, formData);
      setIsEditing(false);
    });
  };

  return (
    <form onSubmit={handleSubmit} id="profile" className="w-full">
      <div className="flex flex-col items-start gap-4">
        <p className="text-white/60">{user.address}</p>
        <div className="flex flex-row gap-8 items-start">
          <Icon size="xl" image={user.profile?.image} seed={user.address} />
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-4">
              <Form.Text
                name="name"
                disabled={!isEditing || isPending}
                defaultValue={user.profile ? user.profile.name || "" : ""}
                aria-disabled={!isEditing || isPending}
              />
              <Form.Radio
                name="available"
                defaultChecked={user.profile?.available}
                disabled={!isEditing || isPending}
                aria-disabled={!isEditing || isPending}
              />
            </div>
            <div style={{ paddingLeft: "3px" }}>
              <p className="text-white/60">
                Member Since:
                <span> {user.createdAt.toLocaleDateString()}</span>
              </p>
              <p className="text-white/60">
                Last Profile Update:
                <span> {user.profile?.updatedAt.toLocaleDateString()}</span>
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="cursor-pointer text-base" onClick={handleEdit}>
              {isEditing ? <div>&#10005;</div> : <Pencil fill="white" height="15px" width="15px" />}
            </div>
          )}
        </div>
        {isOwner && isEditing && (
          <div className="flex flex-row gap-4">
            <Button type="submit">
              <span>Submit</span>
            </Button>
            <Button type="reset">
              <div className="flex flex-row align-middle gap-1 text-dark text-sm">
                <span>Reset</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
