"use client";
import React, { useTransition } from "react";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { Column, Row } from "@/components/Box";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Button } from "@/components/Button";
import { updateUser } from "@/lib/actions/users";

const UserEdit = ({ user }: { user: UserProfile }): JSX.Element => {
  const { toggleOpen } = useModal();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("available", formData.has("available") ? "true" : "false");
    startTransition(async () => {
      await updateUser(user.id, formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div onClick={toggleOpen} className="absolute top-0 right-0 w-5 h-5 cursor-pointer z-10">
        x
      </div>
      <Column className="gap-1 justify-center items-center w-full relative p-10">
        <Icon size="xl" image={user.profile?.image} seed={user.address} />
        <Column className="items-stretch gap-2 my-4">
          <Form.Input
            type="text"
            name="name"
            placeholder="Name..."
            defaultValue={user.profile?.name || ""}
            disabled={isPending}
            aria-disabled={isPending}
          />
          <Form.Radio
            name="available"
            text="is available"
            defaultChecked={user.profile?.available}
            disabled={isPending}
            aria-disabled={isPending}
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
        </Column>
        <Row className="gap-4">
          <Button type="submit" disabled={isPending} aria-disabled={isPending}>
            Submit
          </Button>
          <Button type="reset" disabled={isPending} aria-disabled={isPending}>
            Reset
          </Button>
        </Row>
      </Column>
    </form>
  );
};

export default UserEdit;
