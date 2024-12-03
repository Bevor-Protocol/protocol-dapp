const ABI = {
  _format: "hh-sol-artifact-1",
  contractName: "ERC20Token",
  sourceName: "contracts/ERC20Token.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "totalSupply_",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode:
    "0x60406080815234620003ca5762000d11803803806200001e81620003cf565b928339810190606081830312620003ca57805191602091828101519060018060401b0391828111620003ca578362000058918301620003f5565b9286820151838111620003ca57620000719201620003f5565b91805191808311620002ca5760038054936001938486811c96168015620003bf575b88871014620003a9578190601f9687811162000353575b508890878311600114620002ec57600092620002e0575b505060001982841b1c191690841b1781555b8451918211620002ca5760049485548481811c91168015620002bf575b88821014620002aa578581116200025f575b508690858411600114620001f457938394918492600095620001e8575b50501b92600019911b1c19161782555b3315620001a95750600254908382018092116200019457506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9160025533835282815284832084815401905584519384523393a3516108a99081620004688239f35b601190634e487b7160e01b6000525260246000fd5b60649285519262461bcd60e51b845283015260248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b0151935038806200011f565b9190601f198416928760005284896000209460005b8b898383106200024757505050106200022c575b50505050811b0182556200012f565b01519060f884600019921b161c19169055388080806200021d565b86860151895590970196948501948893500162000209565b86600052876000208680860160051c8201928a8710620002a0575b0160051c019085905b8281106200029357505062000102565b6000815501859062000283565b925081926200027a565b602287634e487b7160e01b6000525260246000fd5b90607f1690620000f0565b634e487b7160e01b600052604160045260246000fd5b015190503880620000c1565b90869350601f19831691856000528a6000209260005b8c8282106200033c575050841162000323575b505050811b018155620000d3565b015160001983861b60f8161c1916905538808062000315565b8385015186558a9790950194938401930162000302565b90915083600052886000208780850160051c8201928b86106200039f575b918891869594930160051c01915b8281106200038f575050620000aa565b600081558594508891016200037f565b9250819262000371565b634e487b7160e01b600052602260045260246000fd5b95607f169562000093565b600080fd5b6040519190601f01601f191682016001600160401b03811183821017620002ca57604052565b919080601f84011215620003ca5782516001600160401b038111620002ca576020906200042b601f8201601f19168301620003cf565b92818452828287010111620003ca5760005b8181106200045357508260009394955001015290565b85810183015184820184015282016200043d56fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146104ad57508163095ea7b31461048357816318160ddd1461046457816323b872dd1461039a578163313ce5671461037e578163395093511461031757816370a08231146102e057816395d89b41146101c1578163a457c2d71461011957508063a9059cbb146100e95763dd62ed3e1461009e57600080fd5b346100e557806003193601126100e557806020926100ba6105d2565b6100c26105ed565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100e557806003193601126100e5576020906101126101086105d2565b6024359033610603565b5160018152f35b905082346101be57826003193601126101be576101346105d2565b918360243592338152600160205281812060018060a01b038616825260205220549082821061016d576020856101128585038733610771565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b8383346100e557816003193601126100e557805190828454600181811c908083169283156102d6575b60209384841081146102c3578388529081156102a75750600114610252575b505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106102935750505050830101858080610209565b80548886018301529301928490820161027d565b60ff1916878501525050151560051b8401019050858080610209565b634e487b7160e01b895260228a52602489fd5b91607f16916101ea565b5050346100e55760203660031901126100e55760209181906001600160a01b036103086105d2565b16815280845220549051908152f35b8284346101be57816003193601126101be576103316105d2565b338252600160209081528383206001600160a01b038316845290528282205460243581019290831061036b57602084610112858533610771565b634e487b7160e01b815260118552602490fd5b5050346100e557816003193601126100e5576020905160128152f35b839150346100e55760603660031901126100e5576103b66105d2565b6103be6105ed565b91846044359460018060a01b0384168152600160205281812033825260205220549060001982036103f8575b602086610112878787610603565b84821061042157509183916104166020969561011295033383610771565b9193948193506103ea565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346100e557816003193601126100e5576020906002549051908152f35b5050346100e557806003193601126100e5576020906101126104a36105d2565b6024359033610771565b8490843461058557826003193601126105855782600354600181811c9080831692831561057b575b60209384841081146102c3578388529081156102a7575060011461052557505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106105675750505050830101858080610209565b805488860183015293019284908201610551565b91607f16916104d5565b8280fd5b6020808252825181830181905290939260005b8281106105be57505060409293506000838284010152601f8019910116010190565b81810186015184820160400152850161059c565b600435906001600160a01b03821682036105e857565b600080fd5b602435906001600160a01b03821682036105e857565b6001600160a01b0390811691821561071e57169182156106cd5760008281528060205260408120549180831061067957604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b0390811691821561082257169182156107d25760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfea2646970667358221220faf22bc0f21b7766fe4316a2573e557ee123cd35b9bc06ecdd3a70583a810d1764736f6c63430008140033",
  deployedBytecode:
    "0x608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146104ad57508163095ea7b31461048357816318160ddd1461046457816323b872dd1461039a578163313ce5671461037e578163395093511461031757816370a08231146102e057816395d89b41146101c1578163a457c2d71461011957508063a9059cbb146100e95763dd62ed3e1461009e57600080fd5b346100e557806003193601126100e557806020926100ba6105d2565b6100c26105ed565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100e557806003193601126100e5576020906101126101086105d2565b6024359033610603565b5160018152f35b905082346101be57826003193601126101be576101346105d2565b918360243592338152600160205281812060018060a01b038616825260205220549082821061016d576020856101128585038733610771565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b8383346100e557816003193601126100e557805190828454600181811c908083169283156102d6575b60209384841081146102c3578388529081156102a75750600114610252575b505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106102935750505050830101858080610209565b80548886018301529301928490820161027d565b60ff1916878501525050151560051b8401019050858080610209565b634e487b7160e01b895260228a52602489fd5b91607f16916101ea565b5050346100e55760203660031901126100e55760209181906001600160a01b036103086105d2565b16815280845220549051908152f35b8284346101be57816003193601126101be576103316105d2565b338252600160209081528383206001600160a01b038316845290528282205460243581019290831061036b57602084610112858533610771565b634e487b7160e01b815260118552602490fd5b5050346100e557816003193601126100e5576020905160128152f35b839150346100e55760603660031901126100e5576103b66105d2565b6103be6105ed565b91846044359460018060a01b0384168152600160205281812033825260205220549060001982036103f8575b602086610112878787610603565b84821061042157509183916104166020969561011295033383610771565b9193948193506103ea565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346100e557816003193601126100e5576020906002549051908152f35b5050346100e557806003193601126100e5576020906101126104a36105d2565b6024359033610771565b8490843461058557826003193601126105855782600354600181811c9080831692831561057b575b60209384841081146102c3578388529081156102a7575060011461052557505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106105675750505050830101858080610209565b805488860183015293019284908201610551565b91607f16916104d5565b8280fd5b6020808252825181830181905290939260005b8281106105be57505060409293506000838284010152601f8019910116010190565b81810186015184820160400152850161059c565b600435906001600160a01b03821682036105e857565b600080fd5b602435906001600160a01b03821682036105e857565b6001600160a01b0390811691821561071e57169182156106cd5760008281528060205260408120549180831061067957604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b0390811691821561082257169182156107d25760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfea2646970667358221220faf22bc0f21b7766fe4316a2573e557ee123cd35b9bc06ecdd3a70583a810d1764736f6c63430008140033",
  linkReferences: {},
  deployedLinkReferences: {},
};

export default ABI;
