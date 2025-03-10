// encryptionUtils.js
async function generateKeyPair() {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048, // veya 4096 daha da güvenli olabilir
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256", // SHA-384 veya SHA-512 de kullanılabilir
        },
        true, // Anahtarların çıkarılabilir olmasını sağlar
        ["encrypt", "decrypt"]
      );
  
      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
      // Anahtarları Base64 formatına dönüştür (saklamak için)
      const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey)));
  
  
      return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
    } catch (error) {
      console.error("Anahtar çifti oluşturma hatası:", error);
      throw error; // Hatayı yeniden fırlat
    }
  }
  
  async function encryptMessage(publicKeyBase64, message) {
    try {
      // Base64'ten PublicKey'e dönüştür
      const publicKeyBytes = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
      const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBytes,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );
  
      const encodedMessage = new TextEncoder().encode(message);
  
      const encryptedMessage = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        encodedMessage
      );
  
      // Şifrelenmiş mesajı Base64 formatına dönüştür (saklamak/göndermek için)
      const encryptedMessageArray = new Uint8Array(encryptedMessage);
      const encryptedMessageBase64 = btoa(String.fromCharCode.apply(null, encryptedMessageArray));
  
      return encryptedMessageBase64;
    } catch (error) {
      console.error("Şifreleme hatası:", error);
      throw error;
    }
  }
  
  async function decryptMessage(privateKeyBase64, encryptedMessageBase64) {
    try {
      // Base64'ten PrivateKey'e dönüştür
        const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
        const privateKey = await window.crypto.subtle.importKey(
          "pkcs8",
          privateKeyBytes,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          true,
          ["decrypt"]
        );
  
        // Base64'ten şifrelenmiş mesaja dönüştür
        const encryptedMessageBytes = Uint8Array.from(atob(encryptedMessageBase64), c => c.charCodeAt(0));
        const encryptedMessage = encryptedMessageBytes.buffer; // ArrayBuffer gerekiyor
  
      const decryptedMessage = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        encryptedMessage
      );
  
      return new TextDecoder().decode(decryptedMessage);
    } catch (error) {
      console.error("Şifre çözme hatası:", error);
      throw error;
    }
  }
  
  export { generateKeyPair, encryptMessage, decryptMessage };