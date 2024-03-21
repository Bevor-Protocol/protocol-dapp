/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState, useTransition } from "react";
import { useAccount } from "wagmi";

import { FallbackIcon } from "@/components/Icon";
import { Row, Column } from "@/components/Box";
import { P, Span } from "@/components/Text";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Common";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Button } from "@/components/Button";
import { Pencil } from "@/assets";
import { updateProfile } from "@/lib/actions/users";

export const UserProfileData = ({ user }: { user: UserProfile }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader $size="50px" />;
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
    <form onSubmit={handleSubmit} id="profile" style={{ width: "100%" }}>
      <Column $align="flex-start" $gap="rem1">
        <P $secondary={true}>{user.address}</P>
        <Row $gap="rem2" $align="flex-start">
          <FallbackIcon size="xl" image={user.profile?.image} address={user.address} />
          <Column $align="flex-start">
            <Row $gap="rem1">
              <Form.Text
                type="text"
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
            </Row>
            <div style={{ paddingLeft: "3px" }}>
              <P $secondary={true}>
                Member Since:
                <Span> {user.createdAt.toLocaleDateString()}</Span>
              </P>
              <P $secondary={true}>
                Last Profile Update:
                <Span> {user.profile?.updatedAt.toLocaleDateString()}</Span>
              </P>
            </div>
          </Column>
          {isOwner && (
            <Form.Edit onClick={handleEdit}>
              {isEditing ? <div>&#10005;</div> : <Pencil fill="white" height="15px" width="15px" />}
            </Form.Edit>
          )}
        </Row>
        {isOwner && isEditing && (
          <Row $gap="rem1">
            <Button type="submit" $pad="6px 8px" $hover="dim">
              Submit
            </Button>
            <Button type="reset" $pad="6px 8px" $hover="dim">
              Reset
            </Button>
          </Row>
        )}
      </Column>
    </form>
  );
};
