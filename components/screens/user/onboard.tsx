"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { userAction } from "@/actions";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import { Icon } from "@/components/Icon";
import ErrorToast from "@/components/Toast/Content/error";
import { useToast } from "@/hooks/useContexts";
import { ErrorTypeEnum } from "@/utils/types/enum";

const UserOnboard = ({ address }: { address: string }): JSX.Element => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const { show } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { userAddress: string; formData: FormData }) =>
      userAction.createUser(variables.userAddress, variables.formData),
    onSuccess: (response) => {
      if (response.success) {
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
              content: <ErrorToast text="something went wrong, try again later" />,
              autoClose: true,
            });
        }
      }
    },
    onError: (error) => {
      console.log(error);
      show({
        content: <ErrorToast text="something went wrong, try again later" />,
        autoClose: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate({ userAddress: address, formData });
  };

  const handleReset = (): void => {
    // allows for resetting the image preview in an uncontrolled manner.
    // default reset still occurs since the HTML is controlled the input values.
    setSelectedImage(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      onChange={() => setErrors({})}
      className="max-w-full w-[700px]"
    >
      <h3 className="text-xl">Welcome to Bevor! Let`s create your profile</h3>
      <p className="text-white/60 my-4">{address}</p>
      <Row className="my-4 justify-between">
        <Column className="gap-2">
          <Form.Image
            name="image"
            selected={selectedImage}
            setSelected={setSelectedImage}
            disabled={isPending}
            aria-disabled={isPending}
          >
            <Icon size="xxl" seed={address} />
          </Form.Image>
          <Form.Input
            type="text"
            text="Display Name"
            name="name"
            disabled={isPending}
            aria-disabled={isPending}
          />
        </Column>
        <Column className="items-stretch gap-4">
          <Form.Radio
            name="available"
            disabled={isPending}
            aria-disabled={isPending}
            defaultChecked={false}
            text="is available"
          />
          <Form.Radio
            name="auditorRole"
            disabled={isPending}
            aria-disabled={isPending}
            defaultChecked={false}
            text="auditor role"
          />
          <Form.Radio
            name="ownerRole"
            disabled={isPending}
            aria-disabled={isPending}
            defaultChecked={false}
            text="owner role"
          />
        </Column>
      </Row>
      <Row className="gap-4">
        <Button type="submit">
          <span>Submit</span>
        </Button>
        <Button type="reset">
          <span>Reset</span>
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

const UserNotExist = ({ address, isOwner }: { address: string; isOwner: boolean }): JSX.Element => {
  // If user doesn't exist, and person doesn't own the wallet for the account
  // trying to be viewed, show this.
  if (!isOwner) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }

  // If user doesn't exist, but person owns the address trying to be viewed,
  // bring them through the onboarding flow (if authenticated)
  return <UserOnboard address={address} />;
};

export default UserNotExist;
