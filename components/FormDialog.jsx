import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { db, auth } from "../firebase.js";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function FormDialog({setIsUpdate}) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isContactExists = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      // Kullanıcının UID ve email bilgisini dön
      const contactDoc = querySnapshot.docs[0]; 
      return { uid: contactDoc.id, email: contactDoc.data().email };
    }
    
    return null;
  };
  
  const getUserData = async (contact, setIsUpdate) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (!userData.contacts) {
            console.log("No contacts field found. Creating new contacts array.");
            await updateDoc(userRef, { contacts: [] });
            userData.contacts = [];
          }
  
          // Eğer bu UID zaten ekliyse tekrar ekleme
          if (userData.contacts.some(c => c.uid === contact.uid)) {
            alert("Contact already exists!");
          } else {
            const updatedContacts = [...(userData.contacts || []), contact];
            await updateDoc(userRef, { contacts: updatedContacts });
            setIsUpdate(prev => !prev);
            alert("Contact added!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    } else {
      console.log("No user is signed in.");
    }
  };
  
  async function handleAddContact() {
    if (email === "") {
      console.log("Email boş olamaz.");
      return;
    }
  
    const contact = await isContactExists(email); 
  
    if (!contact) {
      alert("Contact not exists!");
      return;
    }
  
    await getUserData(contact, setIsUpdate);
  }
  
  return (
    <React.Fragment>
      <Fab onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();  
              handleAddContact();      
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email address of the contact you want to add.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
