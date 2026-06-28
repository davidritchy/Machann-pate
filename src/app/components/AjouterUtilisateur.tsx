import React, { useState  } from "react";
import { collection , addDoc  } from "firebase/firestore";
import { db } from "../../firebase";

function AjouterUtilisateur(){

    const [nom, setNom] = useState("");

    const handleAjouter = async (e) => {
        e.preventDefault();
        if(!nom.trim()) return;
        try {
            const docRef = await addDoc(collection(db, "utilisateurs"), {
                nom: nom,
                creeLe:new Date()
            });
            console.log("Document ajouté avec ID: ", docRef.id);
            setNom("");
            alert("Utilisateur ajouté avec succès !");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Erreur lors de l'ajout de l'utilisateur.");

        }
    };

    return (
        <div>
            <h2>Ajouter un utilisateur</h2>
            <form onSubmit={handleAjouter}>
                <input
                    type="text"
                    placeholder="Nom de l'utilisateur"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
                <button type="submit">Ajouter</button>
            </form>
        </div>

    
    );
}

export default AjouterUtilisateur;