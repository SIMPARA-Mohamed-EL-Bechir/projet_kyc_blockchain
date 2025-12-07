// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Contrat de Certification d'Identité (KYC)
 * @notice Permet à une autorité de certifier et révoquer 
 * le lien entre une identité et une adresse blockchain.
 */
contract CertificationIdentite {

    // --- Variables d'état ---

    // Adresse de l'autorité qui gère les certifications.
    // Concept de vos cours
    address public autorite;

    // Définition d'une structure pour stocker les infos
    // Concept de vos cours
    struct Attestation {
        string identiteReelle; // ex: "Jean Dupont" ou un hash de ses infos
        uint dateCertification;
        bool estCertifie;
    }

    // Un mapping pour lier une adresse (clé) à son Attestation (valeur)
    // Concept de vos cours
    mapping(address => Attestation) public attestations;

    // --- Événements ---

    // Permet à l'interface web (DApp) d'écouter les changements
    // Concept de vos cours
    event IdentiteCertifiee(address indexed utilisateur, string identiteReelle);
    event IdentiteRevoquee(address indexed utilisateur);


    // --- Modificateur ---

    /**
     * @dev Restreint l'exécution d'une fonction à l'autorité seulement.
     * Utilise la variable globale 'msg.sender'
     * Concept de vos cours
     */
    modifier seulementAutorite() {
        // 'require' vérifie une condition. Si elle est fausse, la transaction échoue.
        require(msg.sender == autorite, "Action reservee a l'autorite");
        _; // Indique où le code de la fonction doit s'exécuter
    }


    // --- Constructeur ---

    /**
     * @dev Le constructeur est exécuté 1 seule fois lors du déploiement.
     * Il définit celui qui déploie comme l'autorité.
     * Concept de vos cours
     */
    constructor() {
        // msg.sender est l'adresse qui initie la transaction (ici, le déploiement)
        autorite = msg.sender;
    }


    // --- Fonctions ---

    /**
     * @notice Certifie une nouvelle adresse.
     * @dev Seule l'autorité peut appeler cette fonction (grâce au modificateur).
     * @param _utilisateur L'adresse de l'utilisateur à certifier.
     * @param _identite L'information d'identité (ex: nom, ou un ID).
     */
    function certifier(address _utilisateur, string memory _identite) public seulementAutorite {
        require(_utilisateur != address(0), "Adresse utilisateur invalide");
        
        // On crée ou met à jour l'attestation dans le mapping
        attestations[_utilisateur] = Attestation(
            _identite,
            block.timestamp, // "block.timestamp" est la date actuelle
            true
        );

        // On émet l'événement pour notifier l'extérieur
        emit IdentiteCertifiee(_utilisateur, _identite);
    }

    /**
     * @notice Révoque la certification d'une adresse.
     * @dev Seule l'autorité peut appeler cette fonction.
     * @param _utilisateur L'adresse de l'utilisateur à révoquer.
     */
    function revoquer(address _utilisateur) public seulementAutorite {
        require(attestations[_utilisateur].estCertifie, "Utilisateur n'est pas certifie");
        
        // On marque simplement l'adresse comme non certifiée
        attestations[_utilisateur].estCertifie = false;

        // On émet l'événement de révocation
        emit IdentiteRevoquee(_utilisateur);
    }

    /**
     * @notice Vérifie si une adresse est actuellement certifiée.
     * @dev C'est une fonction 'view' (lecture seule), elle ne coûte pas de gaz.
     * Concept de vos cours
     * @param _utilisateur L'adresse à vérifier.
     * @return bool Le statut de certification.
     */
    function estCertifie(address _utilisateur) public view returns (bool) {
        return attestations[_utilisateur].estCertifie;
    }

    /**
     * @notice Permet à l'autorité de transférer son rôle (optionnel).
     */
    function transfererAutorite(address _nouvelleAutorite) public seulementAutorite {
        require(_nouvelleAutorite != address(0), "Nouvelle autorite invalide");
        autorite = _nouvelleAutorite;
    }
}