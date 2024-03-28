/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo, useState, useTransition } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

import { Icon, Social } from "@/components/Icon";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Loader";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Pencil } from "@/assets";
import { createUser } from "@/lib/actions/users";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";
import { useModal } from "@/hooks/contexts";
import UserEdit from "@/components/Modal/Content/userEdit";

export const UserProfileData = ({ user }: { user: UserProfile }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const { toggleOpen, setContent } = useModal();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader className="h-12" />;
  }

  const handleModal = (): void => {
    setContent(<UserEdit user={user} />);
    toggleOpen();
  };

  return (
    <Column className="gap-1 justify-center items-center w-full relative">
      {isOwner && (
        <Social
          className="absolute right-1/2 top-0 translate-x-[100px] cursor-pointer"
          onClick={handleModal}
        >
          <Pencil height="14px" width="14px" fill="white" />
        </Social>
      )}
      <Icon size="xxl" image={user.profile?.image} seed={user.address} />
      <p className="text-sm">
        {user.profile?.name && <span>{user.profile.name} | </span>}
        <span>{trimAddress(user.address)}</span>
      </p>
      <p className="text-white/60 text-xs">
        Member Since:
        <span> {user.createdAt.toLocaleDateString()}</span>
      </p>
      <Row className="items-stretch gap-4 my-4">
        <Form.Radio
          name="available"
          text="is available"
          checked={user.profile?.available}
          disabled={true}
          aria-disabled={true}
        />
        <Form.Radio
          name="auditorRole"
          text="auditor role"
          checked={user.auditorRole}
          disabled={true}
          aria-disabled={true}
        />
        <Form.Radio
          name="auditeeRole"
          text="auditee role"
          checked={user.auditeeRole}
          disabled={true}
          aria-disabled={true}
        />
      </Row>
      {isOwner && user.auditeeRole && (
        <DynamicLink href="/audits/create">
          <Button>Create Audit</Button>
        </DynamicLink>
      )}
    </Column>
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
