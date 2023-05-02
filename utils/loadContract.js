
import MarketplaceContract from "../artifacts/contracts/CourseMarketplace.sol/CourseMarketplace.json";

export const loadContract = async (web3 ) => {

    const contractAddress = "0xbb3801c873492D5BCA56380994a17FFc1b8137A3";
        
    let contract = null; 

    try {
        contract = new web3.eth.Contract(MarketplaceContract.abi, contractAddress)
        
    } catch (error) {
        console.log(error);
    }
    return contract
}