<template>
  <!-- Page Content -->
  <b-container>
    <b-row class="test">
      <b-col cols="3">
        <div class="list-group">
          <a href="#" class="list-group-item" v-b-modal.createPirateModal
            >Create pirate</a
          >
          <a href="#" class="list-group-item" id="details">Your pirates</a>
          <a href="#" class="list-group-item" id="all_pirates"
            >List all pirates</a
          >
          <a
            href="#"
            class="list-group-item"
            id="attack-target"
            data-toggle="modal"
            data-target="#createAttackModal"
            >Attack</a
          >
        </div>
      </b-col>

      <b-col cols="9">
        <b-row id="pirates">
          <b-col cols="4" v-for="pirate in pirates" :key="pirate.id">
            <div class="card h-100">
              <a href="#"
                ><img
                  class="card-img-top"
                  :src="require(`~/assets/img/${pirate.id}.jpg`)"
                  alt=""
              /></a>
              <div class="card-body">
                <h4 class="card-title">
                  <a href="#"></a>
                </h4>
                <h5>Level: {{ pirate.level }}</h5>
                <p class="card-text">
                  Wins: {{ pirate.wins }}
                  <br />
                  Losses: {{ pirate.losses }}
                  <br />
                  id: {{ pirate.id }}
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted"
                  >&#9733; &#9733; &#9733; &#9733; &#9734;</small
                >
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!--Modal-->
    <b-modal id="createPirateModal" title="Create your pirate" hide-footer>
      <div class="form-group">
        <label for="pirate-name" class="col-form-label">Name:</label>
        <input
          type="text"
          id="pirate-name"
          class="col-lg-4 col-md-6 mb-4"
          v-model="name"
        />
      </div>
      <b-button
        class="mt-3"
        variant="outline-success"
        block
        @click="createPirate()"
        >Create</b-button
      >
    </b-modal>
    <!-- /.modal -->
  </b-container>
</template>

<script>
import Web3 from "web3";
export default {
  data() {
    return {
      name: "",
      web3: null,
      addresses: null,
      pirates: [],
      cryptoPirates: null,
      cryptoPiratesABI: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "_owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "_approved",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "_tokenId",
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
              indexed: false,
              internalType: "uint256",
              name: "pirateId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "dna",
              type: "uint256",
            },
          ],
          name: "NewPirate",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "_from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "_pirateId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "result",
              type: "uint256",
            },
          ],
          name: "attackResult",
          type: "event",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_pirateId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_targetId",
              type: "uint256",
            },
          ],
          name: "attack",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_pirateId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_newDna",
              type: "uint256",
            },
          ],
          name: "changeDna",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_pirateId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "_newName",
              type: "string",
            },
          ],
          name: "changeName",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
          ],
          name: "createRandomPirate",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "getPirate",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          name: "getPiratesByOwner",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "getPiratesLenght",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_pirateId",
              type: "uint256",
            },
          ],
          name: "levelUp",
          outputs: [],
          payable: true,
          stateMutability: "payable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "pirateToOwner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "pirates",
          outputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "dna",
              type: "uint256",
            },
            {
              internalType: "uint32",
              name: "level",
              type: "uint32",
            },
            {
              internalType: "uint32",
              name: "readyTime",
              type: "uint32",
            },
            {
              internalType: "uint16",
              name: "winCount",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "lossCount",
              type: "uint16",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_fee",
              type: "uint256",
            },
          ],
          name: "setLevelUpFee",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
          ],
          name: "setPetContractAddress",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "_balance",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "takeOwnership",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    };
  },
  methods: {
    createPirate() {
      // This is going to take a while, so update the UI to let the user know
      // the transaction has been sent
      this.cryptoPirates.methods
        .createRandomPirate(this.name)
        .send({ from: this.addresses[0], gas: 3000000 })
        .on("receipt", function (receipt) {
          console.log("created");
        })
        .on("error", function (error) {
          console.log("error");
        });
    },
    async getPirates() {
      let len = await this.cryptoPirates.methods
        .getPiratesLenght()
        .call({ from: this.addresses[0], gas: 3000000 });
      console.log(len);
      for (var i = 0; i < len; i++) {
        let pirate = await this.cryptoPirates.methods.getPirate(i).call();
        let pirateObj = {
          name: pirate[0],
          level: pirate[1],
          wins: pirate[2],
          losses: pirate[3],
          id: i,
        };
        this.pirates.push(pirateObj);
      }
    },
    levelUp(pirateId) {},
    attatck(pirateId) {},
    kidnap() {},
  },
  async mounted() {
    const web3Provider = window.ethereum;
    this.web3 = new Web3(web3Provider);

    this.addresses = await window.ethereum.enable();

    //const acc = await this.web3.eth.getAccounts()
    //const bal = await this.web3.eth.getBalance(acc[0])
    //const ethBal = await this.web3.utils.fromWei(bal, 'ether')
    //addr of smart contract on ropsten
    let cryptoPiratesAddress = "0x04a55ddE9083bE3Bf08412914cFcD0116e0B3a4b";
    this.cryptoPirates = new this.web3.eth.Contract(
      this.cryptoPiratesABI,
      cryptoPiratesAddress
    );
    this.getPirates();
  },
};
</script>

<style>
.test {
  margin-top: 4rem;
}
</style>
