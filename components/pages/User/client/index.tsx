/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState, useTransition } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Loader";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Pencil } from "@/assets";
import { updateProfile, createUser } from "@/lib/actions/users";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";

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
      <Column className="items-start gap-4">
        <p className="text-white/60">{user.address}</p>
        <Row className="gap-8 items-start">
          <Icon size="xl" image={user.profile?.image} seed={user.address} />
          <Column className="items-start gap-4">
            <Form.Input
              type="text"
              name="name"
              disabled={!isEditing || isPending}
              defaultValue={user.profile ? user.profile.name || "" : ""}
              aria-disabled={!isEditing || isPending}
            />
            <div className="pl-2">
              <Form.Radio
                name="available"
                defaultChecked={user.profile?.available}
                disabled={!isEditing || isPending}
                aria-disabled={!isEditing || isPending}
              />
              <Form.Radio
                name="auditorRole"
                text="auditor role"
                defaultChecked={user.auditorRole}
                disabled={true}
                aria-disabled={true}
              />
              <Form.Radio
                name="auditeeRole"
                text="auditee role"
                defaultChecked={user.auditeeRole}
                disabled={true}
                aria-disabled={true}
              />
            </div>
            <div className="pl-2">
              <p className="text-white/60 text-xs">
                Member Since:
                <span> {user.createdAt.toLocaleDateString()}</span>
              </p>
              <p className="text-white/60 text-xs">
                Last Profile Update:
                <span> {user.profile?.updatedAt.toLocaleDateString()}</span>
              </p>
            </div>
          </Column>
          {isOwner && (
            <div className="cursor-pointer text-base" onClick={handleEdit}>
              {isEditing ? <div>&#10005;</div> : <Pencil fill="white" height="15px" width="15px" />}
            </div>
          )}
        </Row>
        {isOwner && isEditing && (
          <Row className="gap-4">
            <Button type="submit">
              <span>Submit</span>
            </Button>
            <Button type="reset">
              <Row className="align-middle gap-1 text-dark text-sm">
                <span>Reset</span>
              </Row>
            </Button>
          </Row>
        )}
        {isOwner && !isEditing && user.auditeeRole && (
          <DynamicLink href="/audits/create">
            <Button>Create Audit</Button>
          </DynamicLink>
        )}
      </Column>
    </form>
  );
};

export const UserOnboard = ({ address }: { address: string }): JSX.Element => {
  const mounted = useIsMounted();
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("auditee", formData.has("auditee") ? "true" : "false");
    formData.set("auditor", formData.has("auditor") ? "true" : "false");
    formData.set("available", formData.has("available") ? "true" : "false");
    if (!formData.get("name")) {
      formData.delete("name");
    }

    startTransition(async () => {
      const result = await createUser(address, formData);
      setError(result.error || "");
      if (!result.error) router.refresh();
    });
  };

  if (!mounted) {
    return <Loader className="h-12" />;
  }

  if (mounted && connectedAddress !== address) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }

  return (
    <Column className="gap-8 items-center">
      <h2 className="text-xl">Welcome to Bevor! Let`s create your profile</h2>
      <form onSubmit={handleSubmit} id="profile" className="w-full">
        <Column className="gap-4 items-center">
          <p className="text-white/60">{address}</p>
          <Icon size="xl" seed={address} />
          <label htmlFor="name">
            <p>Display Name</p>
            <Form.Input type="text" name="name" disabled={isPending} aria-disabled={isPending} />
          </label>
          <Column className="items-start gap-4">
            <Form.Radio name="available" disabled={isPending} aria-disabled={isPending} />
            <p>Claim a role</p>
            <Form.Radio name="auditor" disabled={isPending} aria-disabled={isPending} />
            <Form.Radio name="auditee" disabled={isPending} aria-disabled={isPending} />
          </Column>
          <Row className="gap-4">
            <Button type="submit">
              <span>Submit</span>
            </Button>
            <Button type="reset">
              <Row className="align-middle gap-1 text-dark text-sm">
                <span>Reset</span>
              </Row>
            </Button>
          </Row>
        </Column>
      </form>
      {error && <span className="text-rose-400 text-xs">{error}</span>}
    </Column>
  );
};
