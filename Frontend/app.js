// --- ⚠️ CONFIGURATION OBLIGATOIRE ---

// 1. Collez l'adresse de votre contrat déployé sur Sepolia
const contractAddress = "0x25c3c808cf59900d0544e602Ff809a6aB9150922";

// 2. Collez l'ABI (Application Binary Interface) de votre contrat
// (Vous obtenez l'ABI depuis Remix, dans l'onglet "Compiler", 
// cliquez sur le bouton "ABI" pour le copier)
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "utilisateur",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "identiteReelle",
				"type": "string"
			}
		],
		"name": "IdentiteCertifiee",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "utilisateur",
				"type": "address"
			}
		],
		"name": "IdentiteRevoquee",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_utilisateur",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_identite",
				"type": "string"
			}
		],
		"name": "certifier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_utilisateur",
				"type": "address"
			}
		],
		"name": "revoquer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nouvelleAutorite",
				"type": "address"
			}
		],
		"name": "transfererAutorite",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "attestations",
		"outputs": [
			{
				"internalType": "string",
				"name": "identiteReelle",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateCertification",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "estCertifie",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "autorite",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_utilisateur",
				"type": "address"
			}
		],
		"name": "estCertifie",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// --- FIN DE LA CONFIGURATION ---


// Variables globales
let provider;
let signer;
let contract;
let userAddress;
let autoriteAddress;

// Éléments du DOM
const btnConnect = document.getElementById('btnConnect');
const btnCertifier = document.getElementById('btnCertifier');
const btnRevoquer = document.getElementById('btnRevoquer');
const btnVerifier = document.getElementById('btnVerifier');

const spanMonAdresse = document.getElementById('monAdresse');
const spanStatutAutorite = document.getElementById('statutAutorite');
const spanResultatVerification = document.getElementById('resultatVerification');
const preLogs = document.getElementById('logs');
const zoneAdmin = document.getElementById('zoneAdmin');

// Initialisation de l'application
async function init() {
    // Vérifie si MetaMask (ou un provider) est présent
    if (typeof window.ethereum !== 'undefined') {
        log("MetaMask est detecte.");
        
        // Utilise l'objet 'ethers' qui est maintenant chargé
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Attacher les écouteurs aux boutons
        btnConnect.addEventListener('click', connectWallet);
        btnCertifier.addEventListener('click', certifierAdresse);
        btnRevoquer.addEventListener('click', revoquerAdresse);
        btnVerifier.addEventListener('click', verifierAdresse);
        
        // Essayer de se connecter passivement si déjà autorisé
        try {
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                userAddress = accounts[0];
                await setupApp();
            } else {
                log("MetaMask est detecte mais non connecte.");
            }
        } catch (err) {
            log("Erreur de connexion passive: " + err.message);
        }

    } else {
        log("MetaMask n'est pas installe. Veuillez l'installer.");
        alert("MetaMask n'est pas installe.");
    }
}

// Connexion au portefeuille
async function connectWallet() {
    try {
        // Demande la connexion à MetaMask
        const accounts = await provider.send("eth_requestAccounts", []);
        userAddress = accounts[0];
        log("Portefeuille connecte: " + userAddress);
        await setupApp();
    } catch (err)
 {
        log("Erreur de connexion: " + err.message);
    }
}

// Met en place l'application après la connexion
async function setupApp() {
    spanMonAdresse.textContent = userAddress;
    
    // Obtenir le "signer" pour les transactions (écritures)
    signer = provider.getSigner();
    
    // Instancier le contrat
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    // Récupérer l'adresse de l'autorité depuis le contrat
    try {
        autoriteAddress = await contract.autorite();
        log("Adresse de l'autorite: " + autoriteAddress);

        // Vérifier si l'utilisateur connecté EST l'autorité
        if (userAddress.toLowerCase() === autoriteAddress.toLowerCase()) {
            spanStatutAutorite.textContent = "Vous etes l'autorite.";
            zoneAdmin.style.display = 'block'; // Afficher la zone admin
        } else {
            spanStatutAutorite.textContent = "Vous n'etes pas l'autorite.";
            zoneAdmin.style.display = 'none'; // Cacher la zone admin
        }
    } catch (err) {
        log("Erreur: Impossible de lire l'adresse de l'autorite.");
        log("VERIFIEZ que 'contractAddress' et 'contractABI' sont corrects dans app.js !");
        log(err.message);
    }
}

// Fonction pour certifier (Admin)
async function certifierAdresse() {
    const adresseACertifier = document.getElementById('adminCertifierAdresse').value;
    const identite = document.getElementById('adminCertifierIdentite').value;

    if (!ethers.utils.isAddress(adresseACertifier) || identite === "") {
        log("Erreur: Adresse ou identite invalide.");
        return;
    }

    log(`Tentative de certification de ${adresseACertifier} avec l'identite ${identite}...`);
    
    try {
        // Il faut un "signer" pour écrire sur le contrat
        const contractAvecSigner = contract.connect(signer);
        
        // Appel de la fonction 'certifier' du contrat
        const tx = await contractAvecSigner.certifier(adresseACertifier, identite);
        
        log("Transaction envoyee... En attente de minage...");
        log("Hash de la transaction: " + tx.hash);

        // Attendre que la transaction soit minée
        await tx.wait();
        
        log("SUCCESS! Adresse certifiee.");
        
    } catch (err) {
        log("Erreur de certification: " + (err.data ? err.data.message : err.message));
    }
}

// Fonction pour révoquer (Admin)
async function revoquerAdresse() {
    const adresseARevoquer = document.getElementById('adminRevoquerAdresse').value;
    
    if (!ethers.utils.isAddress(adresseARevoquer)) {
        log("Erreur: Adresse invalide.");
        return;
    }

    log(`Tentative de revocation de ${adresseARevoquer}...`);

    try {
        const contractAvecSigner = contract.connect(signer);
        const tx = await contractAvecSigner.revoquer(adresseARevoquer);
        
        log("Transaction envoyee... En attente de minage...");
        log("Hash de la transaction: " + tx.hash);

        await tx.wait();
        
        log("SUCCESS! Adresse revoquee.");

    } catch (err) {
        log("Erreur de revocation: " + (err.data ? err.data.message : err.message));
    }
}

// Fonction pour vérifier (Publique)
async function verifierAdresse() {
    const adresseAVerifier = document.getElementById('publicVerifierAdresse').value;
    
    if (!ethers.utils.isAddress(adresseAVerifier)) {
        log("Erreur: Adresse invalide.");
        spanResultatVerification.textContent = "Adresse invalide.";
        return;
    }

    log(`Verification du statut de ${adresseAVerifier}...`);

    try {
        // C'est une lecture (view), pas besoin de "signer"
        const estCertifie = await contract.estCertifie(adresseAVerifier);
        
        if (estCertifie) {
            spanResultatVerification.textContent = "Cette adresse EST CERTIFIEE.";
            log("Resultat: Certifie.");
        } else {
            spanResultatVerification.textContent = "Cette adresse N'EST PAS certifiee.";
            log("Resultat: Non certifie.");
        }

    } catch (err) {
        log("Erreur de verification: " + err.message);
    }
}

// Fonction utilitaire pour les logs
function log(message) {
    console.log(message);
    preLogs.textContent = `[${new Date().toLocaleTimeString()}] ${message}\n` + preLogs.textContent;
}

// Lancer l'application
init();