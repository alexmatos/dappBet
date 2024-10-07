import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0xE8528CE5B318741BBB7c378F7E84FbFA6039c8DB";

export async function doLogin() {

    if(!window.ethereum) throw new Error(`MetaMask não está instalada!`);

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if(!accounts || !accounts.length) throw new Error(`MetaMask não foi autorizada!`)
    
    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
}

function getContract() {
    if(!window.ethereum) throw new Error(`MetaMask não está instalada!`);

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getDispute() {
    const contract = getContract();
    return contract.methods.dispute().call();
}

export async function placeBet(candidate, amountInEth) {
    const contract = getContract();
    return contract.methods.bet(candidate).send({
        value: Web3.utils.toWei(amountInEth, "ether"),
        gas: 116055,
        gasPrice: "29100000015"
    });
}

export async function finishDispute(winner) {
    const contract = getContract();
    return contract.methods.finish(winner).send();
}

export async function claimPrize(winner) {
    const contract = getContract();
    return contract.methods.claim().send();
}