"use client";
import React, { useState } from "react";
import { Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/hooks/contexts";
import { Icon } from "@/components/Icon";
import { Column, Row } from "@/components/Box";
import { UserStats } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import * as Tooltip from "@/components/Tooltip";
import { Button } from "@/components/Button";
import { updateUser } from "@/lib/actions/users";
import { X, Info } from "@/assets";

const UserEdit = ({ user, stats }: { user: Users; stats: UserStats }): JSX.Element => {
  const { toggleOpen } = useModal();
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  const canUpdateAuditorRole =
    !user.auditorRole || (user.auditorRole && stats.numAuditsAudited == 0);
  const canUpdateAuditeeRole =
    !user.auditeeRole || (user.auditeeRole && stats.numAuditsCreated == 0);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) => {
      return updateUser(user.id, variables.formData);
    },
    onSettled: (data) => {
      console.log(data);
      toggleOpen();
    },
  });

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
    mutate({ formData });
  };

  const handleReset = (): void => {
    // allows for resetting the image preview in an uncontrolled manner.
    // default reset still occurs.
    setSelectedImage(undefined);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <p>Update Profile</p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <div onClick={toggleOpen} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <Row className="justify-center items-center gap-8">
        <Column className="gap-2 items-center">
          <Form.Image name="file" selected={selectedImage} setSelected={setSelectedImage}>
            <Icon size="xxl" image={user.image} seed={user.address} />
          </Form.Image>
          <Form.Input
            type="text"
            name="name"
            placeholder="Name..."
            defaultValue={user.name || ""}
            disabled={isPending}
            aria-disabled={isPending}
          />
        </Column>
        <Row className="gap-2">
          <Column className="gap-2">
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
          <Column className="gap-2">
            <Tooltip.Reference>
              <Tooltip.Trigger>
                <Row className="h-5 items-center">
                  <Info height="1rem" width="1rem" />
                </Row>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" align="end">
                <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                  <div className="p-2">
                    Set your availability. This will be displayed to users and might impact whether
                    you are selected to conduct an audit or not.
                  </div>
                </div>
              </Tooltip.Content>
            </Tooltip.Reference>
            <Tooltip.Reference>
              <Tooltip.Trigger>
                <Row className="h-5 items-center">
                  <Info height="1rem" width="1rem" />
                </Row>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" align="end">
                <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                  <div className="p-2">
                    Adjust your role and whether you want to register as an Auditor. This will
                    change your UI and possible actions. Note that if you are already an Auditor,
                    and you have elected to conduct an audit, you cannot toggle this off.
                  </div>
                </div>
              </Tooltip.Content>
            </Tooltip.Reference>
            <Tooltip.Reference>
              <Tooltip.Trigger>
                <Row className="h-5 items-center">
                  <Info height="1rem" width="1rem" />
                </Row>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" align="end">
                <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                  <div className="p-2">
                    Adjust your role and whether you want to register as an Auditee. This will
                    change your UI and possible actions. Note that if you are already an Auditee,
                    and you have created an Audit, you cannot toggle this off.
                  </div>
                </div>
              </Tooltip.Content>
            </Tooltip.Reference>
          </Column>
        </Row>
      </Row>
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
