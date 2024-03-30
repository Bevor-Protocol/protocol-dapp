"use client";
import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Icon } from "@/components/Icon";
import * as Form from "@/components/Form";
import { createUser } from "@/lib/actions/users";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";

const UserOnboard = ({ address }: { address: string }): JSX.Element => {
  const router = useRouter();
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { userAddress: string; formData: FormData }) =>
      createUser(variables.userAddress, variables.formData),
    onSuccess: (data: { success: boolean; error?: string }) => {
      if (!data.success) {
        setError(data.error!);
      } else {
        router.refresh();
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("auditee", formData.has("auditee") ? "true" : "false");
    formData.set("auditor", formData.has("auditor") ? "true" : "false");
    formData.set("available", formData.has("available") ? "true" : "false");
    if (!formData.get("name")) {
      formData.delete("name");
    }
    mutate({ userAddress: address, formData });
  };

  return (
    <Column className="gap-8 items-center">
      <h2 className="text-xl">Welcome to Bevor! Let`s create your profile</h2>
      <form onSubmit={handleSubmit} id="profile" className="w-full">
        <Column className="gap-4 items-center">
          <p className="text-white/60">{address}</p>
          <Icon size="xl" seed={address} />
          <Form.Input
            type="text"
            text="Display Name"
            name="name"
            disabled={isPending}
            aria-disabled={isPending}
          />
          <Column className="items-stretch gap-4">
            <Form.Radio
              name="available"
              disabled={isPending}
              aria-disabled={isPending}
              defaultChecked={false}
              text="is available"
            />
            <Form.Radio
              name="auditor"
              disabled={isPending}
              aria-disabled={isPending}
              defaultChecked={false}
              text="auditor role"
            />
            <Form.Radio
              name="auditee"
              disabled={isPending}
              aria-disabled={isPending}
              defaultChecked={false}
              text="auditee role"
            />
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

const UserNotExist = ({ address }: { address: string }): JSX.Element => {
  const { address: connectedAddress } = useAccount();

  const isOwner = useMemo(() => {
    return connectedAddress == address;
  }, [address, connectedAddress]);

  // If user doesn't exist, and person doesn't own the wallet for the account
  // trying to be viewed, show this.
  if (!isOwner) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }

  // If user doesn't exist, but person owns the address trying to be viewed,
  // bring them through the onboarding flow
  return <UserOnboard address={address} />;
};

export default UserNotExist;
