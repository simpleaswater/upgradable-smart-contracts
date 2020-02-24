// src/index.js
const Web3 = require("web3");
const {
  ZWeb3,
  Contracts,
  ProxyAdminProject
} = require("@openzeppelin/upgrades");
const { setupLoader } = require("@openzeppelin/contract-loader");

async function main() {
  // Set up web3 object, connected to the local development network, initialize the Upgrades library
  const web3 = new Web3("http://localhost:8545");
  ZWeb3.initialize(web3.currentProvider);

  const loader = setupLoader({ provider: web3 }).web3;

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
  const address1 = instance.options.address;
  console.log("Proxy Contract Address 1: ", address1);

  const todoList1 = loader.fromArtifact("TodoList1", address1);

  // Send a transaction to store() a new value in the Box
  await todoList1.methods
    .addItem("go to class")
    .send({ from: from, gas: 100000, gasPrice: 1e6 });

  // Call the retrieve() function of the deployed Box contract
  var item = await todoList1.methods.getListItem(0).call();
  console.log("TodoList1: List Item 0: ", item);

  //After deploying the contract, you can upgrade it to a new version of
  //the code using the upgradeProxy method, and providing the instance address.
  const TodoList2 = Contracts.getFromLocal("TodoList2");
  const updatedInstance = await project.upgradeProxy(address1, TodoList2);
  const address2 = updatedInstance.options.address;
  console.log("Proxy Contract Address 2: ", address2);

  const todoList2 = loader.fromArtifact("TodoList2", address2);

  // Send a transaction to store() a new value in the Box
  await todoList2.methods
    .addItem("code")
    .send({ from: from, gas: 100000, gasPrice: 1e6 });

  // Call the retrieve() function of the deployed Box contract
  var item0 = await todoList2.methods.getListItem(0).call();
  var item1 = await todoList2.methods.getListItem(1).call();
  console.log("TodoList2: List Item 0: ", item0);
  console.log("TodoList2: List Item 1: ", item1);
}

main();
