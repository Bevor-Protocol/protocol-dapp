"use client";
import React, { useTransition } from "react";
import { Users } from "@prisma/client";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { Column, Row } from "@/components/Box";
import { UserStats } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Button } from "@/components/Button";
import { updateUser } from "@/lib/actions/users";

const UserEdit = ({ user, stats }: { user: Users; stats: UserStats }): JSX.Element => {
  const { toggleOpen } = useModal();
  const [isPending, startTransition] = useTransition();

  const canUpdateAuditorRole =
    !user.auditorRole || (user.auditorRole && stats.numAuditsAudited == 0);
  const canUpdateAuditeeRole =
    !user.auditeeRole || (user.auditeeRole && stats.numAuditsCreated == 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Need to explicitly control for checkbox inputs, especially those that can be disabled.
    formData.set("available", formData.has("available") ? "true" : "false");
    if (canUpdateAuditeeRole) {
      formData.set("auditeeRole", formData.has("auditeeRole") ? "true" : "false");
    } else {
      formData.set("auditeeRole", user.auditeeRole ? "true" : "false");
    }
    if (canUpdateAuditorRole) {
      formData.set("auditorRole", formData.has("auditorRole") ? "true" : "false");
    } else {
      formData.set("auditorRole", user.auditorRole ? "true" : "false");
    }
    startTransition(async () => {
      await updateUser(user.id, formData);
      toggleOpen();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div onClick={toggleOpen} className="absolute top-0 right-0 w-5 h-5 cursor-pointer z-10">
        x
      </div>
      <Column className="gap-1 justify-center items-center w-full relative p-10">
        <Icon size="xl" image={user.image} seed={user.address} />
        <Column className="items-stretch gap-2 my-4">
          <Form.Input
            type="text"
            name="name"
            placeholder="Name..."
            defaultValue={user.name || ""}
            disabled={isPending}
            aria-disabled={isPending}
          />
          <Form.Radio
            name="available"
            text="is available"
            defaultChecked={user.available}
            disabled={isPending}
            aria-disabled={isPending}
          />
          <Form.Radio
            name="auditorRole"
            text="auditor role"
            defaultChecked={user.auditorRole}
            disabled={!canUpdateAuditorRole || isPending}
            aria-disabled={!canUpdateAuditorRole || isPending}
          />
          <Form.Radio
            name="auditeeRole"
            text="auditee role"
            defaultChecked={user.auditeeRole}
            disabled={!canUpdateAuditeeRole || isPending}
            aria-disabled={!canUpdateAuditeeRole || isPending}
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
