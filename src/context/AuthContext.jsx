import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props) {
    const {children} = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    //firebase
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }
    function logout() {
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }
    // global states
    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            //update global state 
            setGlobalUser(user)

            // if there's no user, empty the user state and return from this listener
            if(!user) {
                return
            }

            // if there is a user, then check if the user has data in the database, and if they do, then fetch said data and update the global state
            try {
                setIsLoading(true)

                // 1. docRef- reference for the document {labelled json object, and then we get the doc, and then we snapshot it t osee if there's anything there}
                // 1. doc(db) - specifies db where to fetch from
                // 2. 'users', specifiec collection users
                // 3. 'user.id' - checks for specific userId
                // 4. getDoc() takes a snapshot to check if there is any data with id
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists()) {
                    firebaseData = docSnap.data() //receive the data and assign it
                }
                setGlobalData(firebaseData)
            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        } )

        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
