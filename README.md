````markdown
# 🆔 Système de Certification d'Identité Décentralisé (KYC)

> **Projet #9** - Génie Informatique et Digitalisation (EMI 2025/2026)  
> **Encadrant :** Dr. Abdelilah Maach  
> **Auteur :** Mohamed El Béchir SIMPARA

Ce projet est une **Application Décentralisée (DApp)** permettant à une autorité désignée de certifier l'identité des utilisateurs et de lier cette identité à leurs adresses blockchain de manière sécurisée, transparente et vérifiable sur le réseau Ethereum (Sepolia).

---

## 📋 Table des Matières
- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture Technique](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation et Configuration](#-installation-et-configuration)
- [Comment Utiliser](#-comment-utiliser)
- [Structure du Projet](#-structure-du-projet)

---

## 📝 Description

Dans les systèmes traditionnels, le processus de KYC (*Know Your Customer*) est fragmenté, redondant et centralisé. Ce projet propose une approche décentralisée où :
1.  Une **Autorité de Confiance** (l'administrateur du contrat) certifie une adresse Ethereum après vérification hors-chaîne.
2.  Cette certification est enregistrée de manière **immuable** sur la blockchain.
3.  N'importe quel service tiers peut **vérifier publiquement** et gratuitement si une adresse est certifiée.

---

## ✨ Fonctionnalités

### 🛡️ Pour l'Autorité (Admin)
* **Connexion sécurisée** via MetaMask.
* **Certification** d'une adresse Ethereum avec une identité (ex: Nom/Prénom).
* **Révocation** d'une certification en cas de problème.
* *Sécurité :* Seule l'adresse ayant déployé le contrat peut accéder à ces fonctions.

### 🔍 Pour le Public (Utilisateurs/Tiers)
* **Vérification de statut :** N'importe qui peut entrer une adresse Ethereum pour vérifier si elle possède une certification valide.
* **Transparence :** Accès direct à l'état de la blockchain sans intermédiaire.

---

## 🏗 Architecture Technique

* **Blockchain (Backend) :** Smart Contract écrit en **Solidity** (`^0.8.19`), déployé sur le Testnet **Sepolia**.
* **Frontend :** Interface utilisateur en **HTML5** et **CSS3**.
* **Interaction Web3 :** Librairie **Ethers.js** (v5.2) pour communiquer avec la blockchain.
* **Portefeuille :** **MetaMask** pour la gestion des comptes et la signature des transactions.

---

## 🛠 Prérequis

Avant de lancer le projet, assurez-vous d'avoir :
1.  **MetaMask** installé sur votre navigateur.
2.  Un compte configuré sur le réseau **Sepolia**.
3.  Des **Sepolia ETH** (fonds de test) pour payer les frais de gaz (disponibles via un Faucet).
4.  Un éditeur de code (VS Code recommandé) avec l'extension **Live Server**.

---

## 🚀 Installation et Configuration

### 1. Cloner le projet
```bash
git clone [https://github.com/SIMPARA-Mohamed-EL-Bechir/projet_kyc_blockchain.git]https://github.com/SIMPARA-Mohamed-EL-Bechir/projet_kyc_blockchain.git)
cd projet_kyc_blockchain
````

### 2\. Déployer le Smart Contract

1.  Ouvrez `CertificationIdentite.sol` dans [Remix IDE](https://remix.ethereum.org/).
2.  Compilez le contrat (Version `0.8.19`).
3.  Déployez le contrat sur le réseau **Injected Provider - MetaMask (Sepolia)**.
4.  Copiez **l'adresse du contrat** déployé et **l'ABI** (dans l'onglet Compiler).

### 3\. Configurer le Frontend

1.  Ouvrez le fichier `Frontend/app.js`.
2.  Collez votre adresse de contrat et votre ABI aux endroits indiqués :

<!-- end list -->

```javascript
// app.js
const contractAddress = "VOTRE_ADRESSE_0x...";
const contractABI = [ ... VOTRE_ABI_ICI ... ];
```

### 4\. Lancer l'application

1.  Dans VS Code, faites un clic droit sur `index.html`.
2.  Sélectionnez **"Open with Live Server"**.
3.  Le navigateur s'ouvre (ex: `http://127.0.0.1:5500`).

-----

## 🎮 Comment Utiliser

1.  **Connexion :** Cliquez sur "Connecter MetaMask".
      * *Si vous êtes l'autorité :* Le panneau d'administration apparaît.
      * *Si vous êtes un utilisateur lambda :* Seule la vérification publique est visible.
2.  **Certifier (Admin) :** Entrez l'adresse d'un utilisateur et son nom, puis validez la transaction MetaMask.
3.  **Vérifier (Public) :** Entrez une adresse dans la zone de vérification pour voir son statut ("Certifiée" ou "Non certifiée").

-----

## 📂 Structure du Projet

```
📦 Projet-KYC
 ┣ 📜 CertificationIdentite.sol  # Le Smart Contract (Solidity)
 ┣ 📂 Frontend                   # L'Interface Web
 ┃ ┣ 📜 index.html               # Structure de la page
 ┃ ┣ 📜 style.css                # Mise en forme
 ┃ ┣ 📜 app.js                   # Logique DApp (Connexion Ethers.js)
 ┃ ┗ 📜 ethers-5.2.umd.min.js    # Librairie Web3 (locale)
 ┗ 📜 README.md                  # Documentation du projet
```

-----

*Projet réalisé dans le cadre du module Blockchain à l'École Mohammadia d'Ingénieurs.*

```
```
