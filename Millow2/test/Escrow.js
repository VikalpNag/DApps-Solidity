const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyer, seller, lender, inspector;
  let realEstate, escrow;
  it("saves the addresses", async () => {
    //Setup Accounts
    [buyer, seller, lender, inspector] = await ethers.getSigners();

    //Deploy Real Estate
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    //mint a Nft
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json"
      );
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      lender.address,
      inspector.address
    );

    const result = await escrow.nftAddress();
    expect(result).to.be.equal(realEstate.address);

    const result2 = await escrow.seller();
    expect(result2).to.be.equal(seller.address);
  });
});
