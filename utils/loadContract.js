
import MarketplaceContract from "../artifacts/contracts/CourseMarketplace.sol/CourseMarketplace.json";

export const loadContract = async (web3 ) => {

    const contractAddress = "0xe22CC1811F2B9B23FB6C8980Ee4C2e4Ed3586c0C";
        
    let contract = null;

    try {
        contract = new web3.eth.Contract(MarketplaceContract.abi, contractAddress)
        
    } catch (error) {
        console.log(error);
    }
    return contract
}