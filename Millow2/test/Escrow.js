const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyer, seller, lender, inspector;
  let realEstate, escrow;

  beforeEach(async () => {
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
      inspector.address,
      lender.address
    );

    //approve property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    //list property
    transaction = await escrow.connect(seller).list(1);
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Returns NFT address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
    });

    it("Returns seller", async () => {
      const result2 = await escrow.seller();
      expect(result2).to.be.equal(seller.address);
    });
    it("Returns inspector", async () => {
      const result3 = await escrow.inspector();
      expect(result3).to.be.equal(inspector.address);
    });
    it("Returns lender", async () => {
      const result4 = await escrow.lender();
      expect(result4).to.be.equal(lender.address);
    });
  });

  describe("Listing", () => {
    it("Updates Ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
  });
});
