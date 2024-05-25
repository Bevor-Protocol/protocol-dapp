import { prisma } from "@/db/prisma.server";
import { ethers } from "ethers";

import ERC20Abi from "@/contracts/abis/ERC20Token";
import BevorProtocolAbi from "@/contracts/abis/BevorProtocol";

const seed = async (): Promise<void> => {
  const provider = new ethers.JsonRpcProvider();
  const signer = await provider.getSigner();
  const accounts = await provider.listAccounts();

  const tokenContract = new ethers.Contract(ERC20Abi.address, ERC20Abi.abi, signer);
  const bevorContract = new ethers.Contract(BevorProtocolAbi.address, BevorProtocolAbi.abi, signer);

  const WALLETS = accounts.slice(0, 10).map((acct) => acct.address);

  // Since we don't have a means of distribution, just initially seed all accounts with
  // some test token.
  for (let i = 0; i < WALLETS.length; i++) {
    await tokenContract.transfer(WALLETS[i], 25000);
  }

  // for these, we hardcoded the ID, so we can guarantee that they're unique
  // and retrospectively add on-chain info.

  let auditId;
  let tokenId;

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    20000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[0].address, 20000);

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      20000,
      ERC20Abi.address,
      "I am salt",
    );

  await prisma.audits.update({
    where: {
      id: "number1",
    },
    data: {
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
    },
  });

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    20000,
    ERC20Abi.address,
    "I am salty",
  );

  await tokenContract.transfer(accounts[0].address, 20000);

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      20000,
      ERC20Abi.address,
      "I am salty",
    );

  await prisma.audits.update({
    where: {
      id: "number2",
    },
    data: {
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
    },
  });

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  auditId = await bevorContract.generateAuditId(
    accounts[3].address,
    [accounts[2].address, accounts[5].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    2000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[3].address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[2].address, accounts[5].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      2000,
      ERC20Abi.address,
      "I am salt",
    );

  tokenId = await bevorContract.generateTokenId(auditId, [
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
  ]);

  // @ts-expect-error not recognized, but works.
  await tokenContract.connect(accounts[3]).approve(BevorProtocolAbi.address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .revealFindings(
      ["example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI", "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI"],
      auditId,
    );

  await prisma.audits.update({
    where: {
      id: "number3",
    },
    data: {
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      onchainNftId: BigInt(tokenId as bigint).toString(),
    },
  });

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  // this one is finicky as we can't simulate a finished contract by fast-forwarding
  // time in contract reads on the frontend (we can simulate it as a standalone script).
  auditId = await bevorContract.generateAuditId(
    accounts[3].address,
    [accounts[2].address, accounts[5].address],
    7 * 24 * 60 * 60,
    70 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    2000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[3].address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[2].address, accounts[5].address],
      7 * 24 * 60 * 60,
      70 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      2000,
      ERC20Abi.address,
      "I am salt",
    );

  tokenId = await bevorContract.generateTokenId(auditId, [
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
  ]);

  // @ts-expect-error not recognized, but works.
  await tokenContract.connect(accounts[3]).approve(BevorProtocolAbi.address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .revealFindings(
      ["example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI", "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI"],
      auditId,
    );

  await prisma.audits.update({
    where: {
      id: "number4",
    },
    data: {
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      onchainNftId: BigInt(tokenId as bigint).toString(),
    },
  });

  console.log("updated corresponding DB entries with on-chain data");
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
