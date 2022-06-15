import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default class Auth {
    /**
     * This function creates a user with the email and password provided by the user.
     * @param auth - The firebase.auth.Auth instance.
     * @returns The return value of the function is the return value of the try block.
     */
    static createUser(auth) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            return createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            return error;
        }
    }

    static signIn(auth) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            return signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            return error;
        }
    }

    /**
     * It takes the auth object as a parameter and calls the signOut function with the auth object as a
     * parameter.
     * @param auth - The auth object that was passed to the component.
     */
    static logout(auth) {
        signOut(auth);
    }
}