import { db } from "@/db";
import { ethers } from "ethers";

import { Contracts } from "@/constants/web3";
import BevorProtocolAbi from "@/contracts/abis/BevorProtocol";
import ERC20Abi from "@/contracts/abis/ERC20Token";
import { eq } from "drizzle-orm";
import { audit } from "../schema/audit.sql";

const seed = async (): Promise<void> => {
  const provider = new ethers.JsonRpcProvider();
  const signer = await provider.getSigner();

  // skip the signer for seeding, as the nonce is wrong due to deployer script.
  const [, ...accounts] = await provider.listAccounts();

  const tokenContract = new ethers.Contract(
    Contracts.Localhost.bvrToken.address,
    ERC20Abi.abi,
    signer,
  );
  const bevorContract = new ethers.Contract(
    Contracts.Localhost.bevorProtocol.address,
    BevorProtocolAbi.abi,
    signer,
  );

  const WALLETS = accounts.slice(0, 10).map((acct) => acct.address);

  // Since we don't have a means of distribution, just initially seed all accounts with
  // some test token.
  const startingAmount = 25_000;
  for (let i = 0; i < WALLETS.length; i++) {
    await tokenContract.transfer(WALLETS[i], ethers.parseUnits(startingAmount.toString(), 18));
  }

  // for these, we hardcoded the ID, so we can guarantee that they're unique
  // and retrospectively add on-chain info.

  let auditId;
  let amount = 20_000;

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    amount,
    Contracts.Localhost.bvrToken.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[0].address, ethers.parseUnits(amount.toString(), 18));

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      amount,
      Contracts.Localhost.bvrToken.address,
      "I am salt",
    );

  await db
    .update(audit)
    .set({ onchain_audit_info_id: BigInt(auditId as bigint).toString() })
    .where(eq(audit.title, "Require Onchain 1"));
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    amount,
    Contracts.Localhost.bvrToken.address,
    "I am salty",
  );

  await tokenContract.transfer(accounts[0].address, ethers.parseUnits(amount.toString(), 18));

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      amount,
      Contracts.Localhost.bvrToken.address,
      "I am salty",
    );

  await db
    .update(audit)
    .set({ onchain_audit_info_id: BigInt(auditId as bigint).toString() })
    .where(eq(audit.title, "Require Onchain 2"));

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  amount = 2_000;

  auditId = await bevorContract.generateAuditId(
    accounts[3].address,
    [accounts[2].address, accounts[5].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    amount,
    Contracts.Localhost.bvrToken.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[3].address, ethers.parseUnits(amount.toString(), 18));

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[2].address, accounts[5].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      amount,
      Contracts.Localhost.bvrToken.address,
      "I am salt",
    );

  const tokenId = await bevorContract.generateTokenId(auditId, [
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
  ]);

  await tokenContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .approve(BevorProtocolAbi.address, ethers.parseUnits(amount.toString(), 18));

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .revealFindings(
      ["example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI", "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI"],
      auditId,
    );

  await db
    .update(audit)
    .set({
      onchain_audit_info_id: BigInt(auditId as bigint).toString(),
      onchain_nft_id: BigInt(tokenId as bigint).toString(),
    })
    .where(eq(audit.title, "Require Onchain 3"));

  console.log("updated corresponding DB entries with on-chain data");
};

seed()
  .then(() => console.log("Done Seededing Onchain Data"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
