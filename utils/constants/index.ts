export const navItems = {
  main: [
    {
      url: "/leaderboard",
      text: "leaderboard",
    },
    {
      url: "/audits",
      text: "audits",
    },
    {
      url: "/messaging",
      text: "messaging",
    },
  ],
  dropdown: [
    {
      url: "/dao",
      text: "Governance",
    },
    {
      url: "https://docs.bevor.io",
      text: "Documentation",
    },
  ],
};

export const auditNavItems = [
  {
    text: "Details",
    external: false,
  },
  {
    text: "Audit",
    external: false,
  },
];

export const stats = [
  {
    text: "audits conducted",
    stat: 100,
  },
  {
    text: "unique vulnerabilites uncovered",
    stat: 1_000,
  },
  {
    text: "processed funds",
    stat: 10_000,
    symbol: "$",
  },
  {
    text: "registered auditors",
    stat: 50,
  },
];

export const leaderboard = [
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 10_000,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 100,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
  {
    name: "user 1",
    money: 100,
    active: 2,
    completed: 1,
    available: false,
  },
  {
    name: "user 2",
    money: 200,
    active: 1,
    completed: 0,
    available: false,
  },
  {
    name: "user 3",
    money: 400,
    active: 2,
    completed: 3,
    available: true,
  },
  {
    name: "user 4",
    money: 100,
    active: 0,
    completed: 1,
    available: false,
  },
  {
    name: "user 5 has a really long name and should cut off",
    money: 50,
    active: 2,
    completed: 2,
    available: true,
  },
];

export const audits = [
  {
    auditee: "Protocol 1",
    auditors: ["user 1", "user 2"],
    money: 10_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "open",
  },
  {
    auditee: "Protocol 2",
    auditors: [],
    money: 20_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "soon",
  },
  {
    auditee: "Protocol 3",
    auditors: ["user 2", "user 3"],
    money: 10_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "open",
  },
  {
    auditee: "Protocol 4",
    auditors: ["user 1", "user 2"],
    money: 100,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
  {
    auditee: "Protocol 5",
    auditors: [],
    money: 50_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "soon",
  },
  {
    auditee: "Protocol 6",
    auditors: ["user 1", "user 2", "user 3"],
    money: 2_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
  {
    auditee: "Protocol 7",
    auditors: ["user 3", "user 4", "user 5"],
    money: 200,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
  {
    auditee: "Protocol 8",
    auditors: ["user 2"],
    money: 20_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
  {
    auditee: "Protocol 9",
    auditors: ["user 5", "user 4"],
    money: 100_000,
    description:
      "this is an example description, submitted by the auditee of what their protocol is.",
    status: "closed",
  },
];

export const mockAuditInfo = {
  auditee: "Bevor",
  auditors: ["Certique"],
  money: 100_000,
  description: `# Moonwell audit details
- Total Prize Pool: $100,000 USDC 
  - HM awards: $71,825 USDC 
  - Analysis awards: $4,225 USDC 
  - QA awards: $2,112.50 USDC 
  - Bot Race awards: $6,337.50 USDC 
  - Gas awards: $0 USDC 
  - Judge awards: $9,000 USDC 
  - Lookout awards: $6,000 USDC 
  - Scout awards: $500 USDC 
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2023-07-moonwell/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts July 24, 2023 20:00 UTC 
- Ends July 31, 2023 20:00 UTC

**Note for C4 wardens:** For this contest, gas optimizations are out of scope. The Moonwell \
team will not be awarding prize funds for gas-specific submissions.


## Automated Findings / Publicly Known Issues

// eslint-disable-next-line max-len
Automated findings output for the audit can be found [here](add link to report) within 24 hours \
of audit opening.

*Note for C4 wardens: Anything included in the automated findings output is considered a publicly \
known issue and is ineligible for awards.*
* ChainlinkCompositeOracle \`getPriceAndDecimals\` uses roundId, roundId is deprecated, so this is \
a known issue.
* ChainlinkOracle \`getChainlinkPrice\` checks that roundId is 0, roundId is deprecated, and this is \
a known issue.
* Temporal Governor \`unSetTrustedSenders\` does not check to ensure that there is at least 1 trusted \
sender after removing trusted senders. Because of this, a governance proposal could brick the \
TemporalGovernor and not allow any future governance proposals to be sent through the Temporal Governor again.

### Known Compound v2 Issues

The following issues are known issues with the Compoundv2 codebase, and as such, are considered \
publicly known issues and ineligible for awards.

* Borrowing rewards for markets where a reward speed is not set do not accrue without a user \
calling \`claim\` (or someone calling \`claimBehalf\`).
* When setting reward speed = 0 and later turning it back on (setting a non-zero value) for a \
market, rewards will accrue as if the new rate was always on.
* Assets which are supplied which a user hasn't called \`enterMarkets\` for can still be seized. \
This is working as designed.
* New markets must be added with no collateral factor, and some small amount of the collateral \
token supply must be burned in order to avoid market manipulation. This is a known issue.
* Comptroller \`_rescueFunds\` function does not check the return value of transfer. This is expected.
* MToken \`sweepToken\` does not check the return value of transfer. This is expected.
* All findings in [both](https://github.com/code-423n4/2023-07-moonwell/blob/main/audits/Moonwell_Finance_Smart_Contract_Security_Audit_Report_Halborn_Final.pdf) of the [Halborn audits](https://github.com/code-423n4/2023-07-moonwell/blob/main/audits/Moonwell_Finance_Contracts_V2_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf) are out of scope.

# Overview
The Moonwell Protocol is a fork of Benqi, which is a fork of Compound v2 with features like \
borrow caps and multi-token emissions.

Specific areas of concern include:
* [ChainlinkCompositeOracle](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Oracles/ChainlinkCompositeOracle.sol) which aggregates mulitple exchange rates together.
* [MultiRewardDistributor](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/MultiRewardDistributor/MultiRewardDistributor.sol) allow distributing and rewarding users with multiple tokens per MToken. Parts of this system that require special attention are what happens when hooks fail in the Comptroller. Are there states this system could be in that would allow an attacker to pull more than their pro rata share of rewards out? This contract is based on the Flywheel logic in the [Comptroller](https://github.com/compound-finance/compound-protocol/blob/master/contracts/ComptrollerG7.sol#L1102-L1187).
* [TemporalGovernor](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Governance/TemporalGovernor.sol) which is the cross chain governance contract. Specific areas of concern include delays, the pause guardian, putting the contract into a state where it cannot be updated.

For more in depth review of the MToken <-> Comptroller <-> Multi Reward Distributor, see the Cross Contract Interaction [Documentation](https://github.com/code-423n4/2023-07-moonwell/blob/main/CROSSCONTRACTINTERACTION.md).

More docs can be found on [docs.moonwell.fi](https://docs.moonwell.fi/), but bear in mind that those are for V1 and don't include the changes introduced in V2.

# Scope


| Contract | SLOC | Purpose | Libraries used |  
| ----------- | ----------- | ----------- | ----------- |
| [src/core/MultiRewardDistributor/MultiRewardDistributor.sol](https://github.com/code-423n4/2023-07-moonwell/blob/main
/src/core/MultiRewardDistributor/MultiRewardDistributor.sol) | 745 | This contract \
handles distribution of rewards to 
mToken holders.
  | [\`@openzeppelin/*\`](https://openzeppelin.com/contracts/) |
| [src/core/Comptroller.sol](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Comptroller.sol) | 526 |

## Out of scope

* All files in the [deprecated](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Governance/deprecated/) folder are out of scope
* All files in the [mock](https://github.com/code-423n4/2023-07-moonwell/blob/main/test/mock/) folder are out of scope
* [Safemath](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/SafeMath.sol)
* All openzeppelin dependencies

# Video Walkthroughs
Videos of the codebase walkthrough can be found at the following links:
* Walkthrough of major changes to the Comptroller: [Comptroller Changes](https://www.youtube.com/watch?v=6J-srDiCptA)
* Walkthrough of other changes to the Compound v2 codebase: [Other Changes](https://www.youtube.com/watch?v=L8kkMvtjQWE)
* Walkthrough of the Multi-Reward Distributor: [Multi-Reward Distributor](https://www.youtube.com/watch?v=xAFHItFkXMA)

# Additional Context

The MultiRewardDistributor contains logic that is modified and heavily inspired by Compound \
Flywheel. Verifying the user rewards are properly calculated and this system cannot brick the \
rest of the instance is of utmost importance.

## Scoping Details 
\`\`\`
- If you have a public code repo, please share it here:  
- How many contracts are in scope?:   12
- Total SLoC for these contracts?:  4802
- How many external imports are there?:  1
- How many separate interfaces and struct definitions are there for the contracts within \
scope?:  22 structs, 9 interfaces
- Does most of your code generally use composition or inheritance?:   Inheritance
- How many external calls?:  3 
- What is the overall line coverage percentage provided by your tests?: 80%
- Is this an upgrade of an existing system?: True; Compound with multi-reward contract \
to handle distributing rewards in multiple assets per cToken, plus a cross chain governance \
system as well as a WETHRouter to allow users to go into mETH without having the protocol natively handle ETH.
- Check all that apply (e.g. timelock, NFT, AMM, ERC20, rollups, etc.): Multi-Chain, \
ERC-20 Token, Timelock function
- Is there a need to understand a separate part of the codebase / get context in order \
to audit this part of the protocol?:   True
- Please describe required context:   Understand governance system on moonbeam to \
figure out how temporal governance works
- Does it use an oracle?:  Yes, chainlink
- Describe any novel or unique curve logic or mathematical models your code uses: n/a
- Is this either a fork of or an alternate implementation of another project?:   True; Compound with MRD
- Does it use a side-chain?: False
- Describe any specific areas you would like addressed: Would like to see people try \
to break the MRD logic, the temporal governor, the weth router, and take a deep look at \
the deployment script for any possible misconfigurations of the system. also any issues \
with calls to MRD from other parts of the system enabling theft of rewards or claiming \
of rewards that users aren't entitled to
\`\`\`



# Moonwell Protocol v2

The Moonwell Protocol is a fork of Benqi, which is a fork of Compound v2 with things \
like borrow caps and multi-token
emissions. 

The "v2" release of the Moonwell Protocol is a major system upgrade to use solidity 0.8.17, \
add supply caps, and a number
of improvements for user experience (things like \`mintWithPermit\` and \`claimAllRewards\`). \
Solidity version 0.8.20 was not used because EIP-3855 which adds the PUSH0 opcode will not be \
live on base where this system will be deployed.

# Running + Development

Development will work with the latest version of foundry installed.

Basic development workflow:
- use \`forge build\` to build the smart contracts
- use \`forge test -vvv --match-contract UnitTest\` to run the unit tests
- use \`forge test --match-contract IntegrationTest --fork-url $ETH_RPC_URL\` to run the integration tests
- use \`forge test --match-contract ArbitrumTest --fork-url $ARB_RPC_URL\` to run the \
ChainlinkCompositeOracle tests
- use \`forge test --match-contract LiveSystemTest --fork-url baseGoerli\` to run the \
base goerli live system tests
- use \`forge script test/proposals/DeployProposal.s.sol:DeployProposal -vvvv --rpc-url \
$ETH_RPC_URL\` to do a dry run of the deployment script

`,
  deliverable: `# Moonwell OpenZeppelin Audit

## Findings / Gas Optimizations

Automated findings output for the audit can be found [here](add link to report) within 24 \
hours of audit opening.

*Note for C4 wardens: Anything included in the automated findings output is considered a \
publicly known issue and is ineligible for awards.*
* ChainlinkCompositeOracle \`getPriceAndDecimals\` uses roundId, roundId is deprecated, \
so this is a known issue.
* ChainlinkOracle \`getChainlinkPrice\` checks that roundId is 0, roundId is deprecated, \
and this is a known issue.
* Temporal Governor \`unSetTrustedSenders\` does not check to ensure that there is at least \
1 trusted sender after removing trusted senders. Because of this, a governance proposal \
could brick the TemporalGovernor and not allow any future governance proposals to be sent \
through the Temporal Governor again.

### Known Compound v2 Issues

The following issues are known issues with the Compoundv2 codebase, and as such, are \
considered publicly known issues and ineligible for awards.

* Borrowing rewards for markets where a reward speed is not set do not accrue without \
a user calling \`claim\` (or someone calling \`claimBehalf\`).
* When setting reward speed = 0 and later turning it back on (setting a non-zero value) \
for a market, rewards will accrue as if the new rate was always on.
* Assets which are supplied which a user hasn't called \`enterMarkets\` for can still be \
seized. This is working as designed.
* New markets must be added with no collateral factor, and some small amount of the \
collateral token supply must be burned in order to avoid market manipulation. This is a known issue.
* Comptroller \`_rescueFunds\` function does not check the return value of transfer. This is expected.
* MToken \`sweepToken\` does not check the return value of transfer. This is expected.
* All findings in [both](https://github.com/code-423n4/2023-07-moonwell/blob/main/audits/Moonwell_Finance_Smart_Contract_Security_Audit_Report_Halborn_Final.pdf) of the [Halborn audits](https://github.com/code-423n4/2023-07-moonwell/blob/main/audits/Moonwell_Finance_Contracts_V2_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf) are out of scope.

# Overview
The Moonwell Protocol is a fork of Benqi, which is a fork of Compound v2 with features \
like borrow caps and multi-token emissions.

Specific areas of concern include:
* [ChainlinkCompositeOracle](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Oracles/ChainlinkCompositeOracle.sol) which aggregates mulitple exchange rates together.
* [MultiRewardDistributor](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/MultiRewardDistributor/MultiRewardDistributor.sol) allow distributing and rewarding users with multiple tokens per MToken. Parts of this system that require special attention are what happens when hooks fail in the Comptroller. Are there states this system could be in that would allow an attacker to pull more than their pro rata share of rewards out? This contract is based on the Flywheel logic in the [Comptroller](https://github.com/compound-finance/compound-protocol/blob/master/contracts/ComptrollerG7.sol#L1102-L1187).
* [TemporalGovernor](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Governance/TemporalGovernor.sol) which is the cross chain governance contract. Specific areas of concern include delays, the pause guardian, putting the contract into a state where it cannot be updated.

For more in depth review of the MToken <-> Comptroller <-> Multi Reward Distributor, see the Cross Contract Interaction [Documentation](https://github.com/code-423n4/2023-07-moonwell/blob/main/CROSSCONTRACTINTERACTION.md).

More docs can be found on [docs.moonwell.fi](https://docs.moonwell.fi/), but bear in mind that those are for V1 and don't include the changes introduced in V2.

# Scope


| Contract | SLOC | Purpose | Libraries used |  
| ----------- | ----------- | ----------- | ----------- |
| [src/core/MultiRewardDistributor/MultiRewardDistributor.sol](https://github.com/code-423n4/2023-07-moonwell/blob/main
/src/core/MultiRewardDistributor/MultiRewardDistributor.sol) | 745 | This contract \
handles distribution of rewards to 
mToken holders.
  | [\`@openzeppelin/*\`](https://openzeppelin.com/contracts/) |
| [src/core/Comptroller.sol](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Comptroller.sol) | 526 |

## Out of scope

* All files in the [deprecated](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/Governance/deprecated/) folder are out of scope
* All files in the [mock](https://github.com/code-423n4/2023-07-moonwell/blob/main/test/mock/) folder are out of scope
* [Safemath](https://github.com/code-423n4/2023-07-moonwell/blob/main/src/core/SafeMath.sol)
* All openzeppelin dependencies

# Video Walkthroughs
Videos of the codebase walkthrough can be found at the following links:
* Walkthrough of major changes to the Comptroller: [Comptroller Changes](https://www.youtube.com/watch?v=6J-srDiCptA)
* Walkthrough of other changes to the Compound v2 codebase: [Other Changes](https://www.youtube.com/watch?v=L8kkMvtjQWE)
* Walkthrough of the Multi-Reward Distributor: [Multi-Reward Distributor](https://www.youtube.com/watch?v=xAFHItFkXMA)

# Additional Context

The MultiRewardDistributor contains logic that is modified and heavily inspired by \
Compound Flywheel. Verifying the user rewards are properly calculated and this system \
cannot brick the rest of the instance is of utmost importance.

## Scoping Details 
\`\`\`
- If you have a public code repo, please share it here:  
- How many contracts are in scope?:   12
- Total SLoC for these contracts?:  4802
- How many external imports are there?:  1
- How many separate interfaces and struct definitions are there for the contracts within\
 scope?:  22 structs, 9 interfaces
- Does most of your code generally use composition or inheritance?:   Inheritance
- How many external calls?:  3 
- What is the overall line coverage percentage provided by your tests?: 80%
- Is this an upgrade of an existing system?: True; Compound with multi-reward contract \
to handle distributing rewards in multiple assets per cToken, plus a cross chain governance\
 system as well as a WETHRouter to allow users to go into mETH without having the \
 protocol natively handle ETH.
- Check all that apply (e.g. timelock, NFT, AMM, ERC20, rollups, etc.): Multi-Chain, \
ERC-20 Token, Timelock function
- Is there a need to understand a separate part of the codebase / get context in order \
to audit this part of the protocol?:   True
- Please describe required context:   Understand governance system on moonbeam to \
figure out how temporal governance works
- Does it use an oracle?:  Yes, chainlink
- Describe any novel or unique curve logic or mathematical models your code uses: n/a
- Is this either a fork of or an alternate implementation of another project?:   True; Compound with MRD
- Does it use a side-chain?: False
- Describe any specific areas you would like addressed: Would like to see people try \
to break the MRD logic, the temporal governor, the weth router, and take a deep look at \
the deployment script for any possible misconfigurations of the system. also any issues \
with calls to MRD from other parts of the system enabling theft of rewards or claiming \
of rewards that users aren't entitled to
\`\`\`



# Moonwell Protocol v2

The Moonwell Protocol is a fork of Benqi, which is a fork of Compound v2 with things \
like borrow caps and multi-token
emissions. 

The "v2" release of the Moonwell Protocol is a major system upgrade to use solidity 0.8.17, \
add supply caps, and a number
of improvements for user experience (things like \`mintWithPermit\` and \`claimAllRewards\`). \
Solidity version 0.8.20 was not used because EIP-3855 which adds the PUSH0 opcode will not \
be live on base where this system will be deployed.

# Running + Development

Development will work with the latest version of foundry installed.

Basic development workflow:
- use \`forge build\` to build the smart contracts
- use \`forge test -vvv --match-contract UnitTest\` to run the unit tests
- use \`forge test --match-contract IntegrationTest --fork-url $ETH_RPC_URL\` to run the integration tests
- use \`forge test --match-contract ArbitrumTest --fork-url $ARB_RPC_URL\` to run the \
ChainlinkCompositeOracle tests
- use \`forge test --match-contract LiveSystemTest --fork-url baseGoerli\` to run the \
base goerli live system tests
- use \`forge script test/proposals/DeployProposal.s.sol:DeployProposal -vvvv --rpc-url \
$ETH_RPC_URL\` to do a dry run of the deployment script

`,
  status: "open",
  cliff: 100,
  start: 0,
  duration: 1000,
  slicePeriodSeconds: 100,
  withdrawlPaused: false,
  amountTotal: 100,
  withdrawn: 35,
  auditInvalidated: false,
  token: "0x0",
  tokenId: 3,
};

export const mockAuditInfoInvalid = {
  auditee: "Bevor",
  auditors: ["Certique"],
  money: 100_000,
  description:
    "this is an example description, submitted by the auditee of what their protocol is.",
  status: "open",
  cliff: 100,
  start: 0,
  duration: 1000,
  slicePeriodSeconds: 100,
  withdrawlPaused: true,
  amountTotal: 100,
  withdrawn: 35,
  auditInvalidated: true,
  token: "0x0",
  tokenId: 3,
};

export const mockAuditInfoPaused = {
  auditee: "Bevor",
  auditors: ["Certique"],
  money: 100_000,
  description:
    "this is an example description, submitted by the auditee of what their protocol is.",
  status: "open",
  cliff: 100,
  start: 0,
  duration: 1000,
  slicePeriodSeconds: 100,
  withdrawlPaused: true,
  amountTotal: 100,
  withdrawn: 35,
  auditInvalidated: false,
  token: "0x0",
  tokenId: 3,
};
