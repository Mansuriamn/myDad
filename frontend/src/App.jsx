import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlY48wIHQvCGwqb7da7m2Sn0XsbMCMqNg",
  authDomain: "signup-1f80b.firebaseapp.com",
  databaseURL: "https://signup-1f80b-default-rtdb.firebaseio.com",
  projectId: "signup-1f80b",
  storageBucket: "signup-1f80b.appspot.com",
  messagingSenderId: "534035974426",
  appId: "1:534035974426:web:4a983d6a53bbe5ca5504a3",
  measurementId: "G-0S0PLWBV2Q",
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const database = getDatabase(app);

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const messagesRef = ref(database, "messages");
      await push(messagesRef, {
        ...formData,
        timestamp: new Date().toISOString()
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>
      
      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          marginBottom: "20px",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "10px",
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          marginBottom: "20px",
          borderRadius: "4px"
        }}>
          Form submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App;