const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

const db = admin.firestore();

exports.submitScore = functions
    .https
    .onRequest((req, res) => {
      cors(req, res, async () => {
        try {
          const {name, score} = req.body;

          if (!name || typeof score !== "number") {
            return res.status(400).send("Invalid input");
          }

          const scoresRef = db.collection("movies");

          // Check for existing entries with same name
          const snapshot = await scoresRef.where(
              "name", "==", name,
          ).limit(1).get();

          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const storedName = name;

            if (doc.data().name === storedName) {
              // ✅ Same player — update score only if higher
              if (score > doc.data().score) {
                await doc.ref.update({score});
              }
            } else {
              // ⚠️ Name exists, but NOT same player — generate new name
              const newName = `${name}${
                Math.floor(100 + Math.random() * 9000000)
              }`; // 3–9 digit suffix
              await scoresRef.add({name: newName, score});
            }
          } else {
            // Name doesn't exist — create new
            await scoresRef.add({name, score});
          }

          res.status(200).send("Score processed");
        } catch (error) {
          res.status(500).send("Internal Server Error");
        }
      });
    });


exports.getHighScores = functions
    .https
    .onRequest((req, res) => {
      cors(req, res, async () => {
        try {
          const snapshot = await db.collection("movies").get();
          const data = snapshot.docs.map((doc) => doc.data());
          res.status(200).json(data);
        } catch (error) {
          res.status(500).send("Error: " + error.message);
        }
      });
    });

