const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const readContent = async () => {
    const content = await fs.readFile(path.join(__dirname, 'db', 'contacts.json'), 'utf-8');
    const result = JSON.parse(content);
    return result
}

const listContacts = async() => {
  return await readContent()
}

const getContactById = async(contactId) => {
    const contacts = await readContent();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact
}

const removeContact = async(contactId) => {
    const contacts = await readContent();
    let contactToDel 
    const newContacts = contacts.reduce((storage, contact) => {
        if (contact.id === contactId) {
            contactToDel = contact
        } else {
            storage.push(contact);
        }
        return storage
    }, [])
    if (!contactToDel) {
        return
    }
    await fs.writeFile(
        path.join(__dirname, 'db', 'contacts.json'),
        JSON.stringify(newContacts, null, 2));
    return contactToDel
}

const addContact = async (initialData) => {
      const{name, email, phone}=initialData
    if (!Object.values(initialData).every((initialData) => initialData)) {
        return 'Please fill all fields correctly'
    }
    const contacts = await readContent();
    const newContact = { name, email, phone, id: crypto.randomUUID() };
    contacts.push(newContact);
    await fs.writeFile(
        path.join(__dirname, 'db', 'contacts.json'),
        JSON.stringify(contacts, null, 2));
    return newContact
}

module.exports = {listContacts, getContactById, removeContact, addContact}