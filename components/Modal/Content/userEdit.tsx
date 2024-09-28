"use client";
import { Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { userController } from "@/actions";
import { Info, X } from "@/assets";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Icon } from "@/components/Icon";
import * as Tooltip from "@/components/Tooltip";
import { useModal } from "@/hooks/useContexts";
import { UserStats } from "@/utils/types";

const UserEdit = ({ user, stats }: { user: Users; stats: UserStats }): JSX.Element => {
  const { toggleOpen } = useModal();
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allowAuditorUpdate = !user.auditorRole || (user.auditorRole && stats.numAuditsAudited == 0);
  const allowAuditeeUpdate = !user.auditeeRole || (user.auditeeRole && stats.numAuditsCreated == 0);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) => {
      return userController.updateUser(variables.formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toggleOpen();
      } else {
        if (response.validationErrors) {
          setErrors(response.validationErrors);
        }
      }
    },
    onError: () => {
      setErrors({ arbitrary: "something went wrong, try again later" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate({ formData });
  };

  const handleReset = (): void => {
    // allows for resetting the image preview in an uncontrolled manner.
    // default reset still occurs since the HTML is controlled the input values.
    setSelectedImage(undefined);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} onChange={() => setErrors({})}>
      <p>Update Profile</p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <div
        onClick={(): void => toggleOpen()}
        className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10"
      >
        <X height="1rem" width="1rem" />
      </div>
      <Row className="justify-center items-center gap-8">
        <Column className="gap-2 items-center">
          <Form.Image
            name="image"
            selected={selectedImage}
            setSelected={setSelectedImage}
            disabled={isPending}
            aria-disabled={isPending}
          >
            <Icon size="xxl" image={user.image} seed={user.address} />
          </Form.Image>
          <Form.Input
            type="text"
            name="name"
            placeholder="Name..."
            defaultValue={user.name || ""}
            disabled={isPending}
            aria-disabled={isPending}
            isError={"name" in errors}
          />
        </Column>
        <Row className="gap-2">
          <Column className="gap-2">
            <Form.Radio
              name="available"
              text="is available"
              defaultChecked={user.available}
              disabled={isPending || !user.auditorRole}
              aria-disabled={isPending || !user.auditorRole}
              isError={"available" in errors}
            />
            <Form.Radio
              name="auditorRole"
              text="auditor role"
              defaultChecked={user.auditorRole}
              disabled={!allowAuditorUpdate || isPending}
              aria-disabled={!allowAuditorUpdate || isPending}
              isError={"auditorRole" in errors}
            />
            <Form.Radio
              name="auditeeRole"
              text="auditee role"
              defaultChecked={user.auditeeRole}
              disabled={!allowAuditeeUpdate || isPending}
              aria-disabled={!allowAuditeeUpdate || isPending}
              isError={"auditeeRole" in errors}
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
                    you are selected to conduct an audit or not. Only used by Auditors.
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
      {errors &&
        Object.values(errors).map((error, ind) => (
          <p key={ind} className="text-xs text-red-500">
            {error}
          </p>
        ))}
    </form>
  );
};

export default UserEdit;
