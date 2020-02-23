// src/index.js
const Web3 = require("web3");
const {
  ZWeb3,
  Contracts,
  ProxyAdminProject
} = require("@openzeppelin/upgrades");

async function main() {
  // Set up web3 object, connected to the local development network, initialize the Upgrades library
  const web3 = new Web3("http://localhost:8545");
  ZWeb3.initialize(web3.currentProvider);

  //Fetch the default account
  const from = await ZWeb3.defaultAccount();

  //creating a new project, to manage our upgradeable contracts.
  const project = new ProxyAdminProject("MyProject", null, null, {
    from,
    gas: 1e6,
    gasPrice: 1e9
  });

  //Using this project, we can now create an instance of any contract.
  //The project will take care of deploying it in such a way it can be upgraded later.
  const TodoList1 = Contracts.getFromLocal("TodoList1");
  const instance = await project.createProxy(TodoList1);
  const address = instance.options.address;
  console.log("Proxy Contract Address 1: ", address);

  //After deploying the contract, you can upgrade it to a new version of
  //the code using the upgradeProxy method, and providing the instance address.
  const TodoList2 = Contracts.getFromLocal("TodoList2");
  const updatedInstance = await project.upgradeProxy(address, TodoList2);
  console.log("Proxy Contract Address 2: ", updatedInstance.options.address);
}

main();
