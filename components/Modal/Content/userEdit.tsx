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
import { X } from "@/assets";

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
    <form onSubmit={handleSubmit}>
      <div onClick={toggleOpen} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <Column className="gap-4 justify-center items-center w-full relative">
        <Icon size="xl" image={user.image} seed={user.address} />
        <Column className="items-stretch gap-2">
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
      </Column>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button type="submit" disabled={isPending} aria-disabled={isPending}>
          Submit
        </Button>
        <Button type="reset" disabled={isPending} aria-disabled={isPending}>
          Reset
        </Button>
      </Row>
    </form>
  );
};

export default UserEdit;
