const { LinkToken } = require("@chainlink/contracts/truffle/v0.4/LinkToken");
const { Oracle } = require("@chainlink/contracts/truffle/v0.6/Oracle");
const EACAggregatorProxy = artifacts.require("EACAggregatorProxy");
const AccessControlledAggregator = artifacts.require(
  "AccessControlledAggregator"
);

module.exports = async (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  let paymentAmount = 1;
  let timeout = 100;
  // Validator address cannot be null, ran into a plethora of issues when it was null although it says it's optional.
  let validator = "0xb1b2ffdacfa01829e6e5a83df8ea4268a6f3b480";
  let min = 0;
  let max = 1000;
  let decimals = 4;
  let desc = "a Description";
  try {
    LinkToken.setProvider(deployer.provider);
    Oracle.setProvider(deployer.provider);

    await deployer.deploy(LinkToken, {
      from: defaultAccount,
    });
    const linkTokenDeployed = await LinkToken.deployed();
    if (linkTokenDeployed) {
      await deployer.deploy(Oracle, linkTokenDeployed.address, {
        from: defaultAccount,
      });
    }
   await deployer.deploy(
      AccessControlledAggregator,
      "0xff518D04cE55618D8E4485e8Fd62bc9fE6702C03",
      paymentAmount,
      timeout,
      validator,
      min,
      max,
      decimals,
      desc,
      {
        from: defaultAccount,
      }
    );
    const accessControlledAggregatorDeployed = await AccessControlledAggregator.deployed()
    await deployer.deploy(EACAggregatorProxy, accessControlledAggregatorDeployed.address, validator, {
      from: defaultAccount,
    });
  } catch (err) {
    console.error(err);
  }
};
