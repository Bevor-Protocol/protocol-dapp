"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { userAction } from "@/actions";
import { Info, X } from "@/assets";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Icon } from "@/components/Icon";
import ErrorToast from "@/components/Toast/Content/error";
import SuccessToast from "@/components/Toast/Content/success";
import * as Tooltip from "@/components/Tooltip";
import { useModal, useToast } from "@/hooks/useContexts";
import { UserStats } from "@/utils/types/custom";
import { ErrorTypeEnum } from "@/utils/types/enum";
import { User } from "@/utils/types/tables";
import { useRouter } from "next/navigation";

const UserEdit = ({ user, stats }: { user: User; stats: UserStats }): JSX.Element => {
  const { hide } = useModal();
  const { show } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allowAuditorUpdate =
    !user.auditor_role || (user.auditor_role && stats.numAuditsAudited == 0);
  const allowOwnerUpdate = !user.owner_role || (user.owner_role && stats.numAuditsCreated == 0);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) => {
      return userAction.updateUser(variables.formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        hide();
        show({
          content: <SuccessToast text="profile updated" />,
          autoClose: true,
        });
        router.refresh();
      } else {
        const error = response.error;
        switch (error.type) {
          case ErrorTypeEnum.VALIDATION:
          case ErrorTypeEnum.BLOB:
            setErrors(error.validationErrors);
            break;
          default:
            show({
              content: <ErrorToast text="something went wrong" subText="try again later" />,
              autoClose: true,
              direction: "bottom-center",
            });
        }
      }
    },
    onError: (error) => {
      console.log(error);
      show({
        content: <ErrorToast text="something went wrong" subText="try again later" />,
        autoClose: true,
        direction: "bottom-center",
      });
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
      <div onClick={hide} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
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
              disabled={isPending || !user.auditor_role}
              aria-disabled={isPending || !user.auditor_role}
              isError={"available" in errors}
            />
            <Form.Radio
              name="auditor_role"
              text="auditor role"
              // potentially add a handler so that a user can set their availability if this is toggled on.
              defaultChecked={user.auditor_role}
              disabled={!allowAuditorUpdate || isPending}
              aria-disabled={!allowAuditorUpdate || isPending}
              isError={"auditorRole" in errors}
            />
            <Form.Radio
              name="owner_role"
              text="owner role"
              defaultChecked={user.owner_role}
              disabled={!allowOwnerUpdate || isPending}
              aria-disabled={!allowOwnerUpdate || isPending}
              isError={"ownerRole" in errors}
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
                    Adjust your role and whether you want to register as a Protocol Owner. This will
                    change your UI and possible actions. Note that if you are already an Owner, and
                    you have created an Audit, you cannot toggle this off.
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
