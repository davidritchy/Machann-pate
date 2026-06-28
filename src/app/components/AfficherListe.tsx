import React , { useState , useEffect} from "react";
import { collection , getDocs , onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function AfficherListe(){

    const [utilisateurs, setUtilisateurs] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "utilisateurs"), (querySnapshot) => {
            const utilisateursList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUtilisateurs(utilisateursList);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                {utilisateurs.map(utilisateur => (
                    <li key={utilisateur.id}>
                        {utilisateur.nom}-{utilisateur.creeLe.toDate().toLocaleString()}
                        - ID: {utilisateur.id}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AfficherListe;