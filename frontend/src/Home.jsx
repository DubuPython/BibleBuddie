import React, { useState, useEffect } from 'react';

const kidFriendlyVerses = [
  { text: "For God so loved the world, that he gave his only begotten Son...", ref: "John 3:16" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
  { text: "In the beginning God created the heaven and the earth.", ref: "Genesis 1:1" },
  { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
  { text: "Be strong and of a good courage, fear not, nor be afraid of them...", ref: "Deuteronomy 31:6" },
  { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
  { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" }
];

// Curated list of major Catholic Feast Days
const feastDays = {
  "1-1": "Today is the Solemnity of Mary, Mother of God!",
  "2-14": "Today is the Feast of St. Valentine, a 3rd-century saint known for his love and charity.",
  "3-17": "Today is the Feast of St. Patrick, who used the three-leaf shamrock to explain the Holy Trinity to the people of Ireland.",
  "3-19": "Today is the Feast of St. Joseph, the earthly father of Jesus and patron saint of workers.",
  "4-23": "Today is the Feast of St. George, the brave soldier who is often pictured defeating a dragon!",
  "5-30": "Today is the Feast of St. Joan of Arc, the brave young heroine of France.",
  "6-29": "Today is the Feast of Saints Peter and Paul, the two greatest apostles of the early Church.",
  "7-25": "Today is the Feast of St. James the Apostle, the patron saint of pilgrims.",
  "8-15": "Today we celebrate the Assumption of the Blessed Virgin Mary into Heaven.",
  "8-28": "Today is the Feast of St. Augustine, one of the greatest teachers of the early Church.",
  "9-29": "Today is the Feast of the Archangels: Michael, Gabriel, and Raphael!",
  "10-1": "Today is the Feast of St. Thérèse of Lisieux, who taught us the 'Little Way' of doing small things with great love.",
  "10-4": "Today is the Feast of St. Francis of Assisi, the beloved patron saint of animals and the environment!",
  "11-1": "Today is All Saints' Day, a special day where we celebrate all the holy men and women in Heaven.",
  "11-2": "Today is All Souls' Day, a day to pray for all of our loved ones who have gone to Heaven.",
  "12-6": "Today is the Feast of St. Nicholas, the generous bishop who inspired the story of Santa Claus!",
  "12-12": "Today is the Feast of Our Lady of Guadalupe, celebrating Mary's appearance to St. Juan Diego in Mexico.",
  "12-25": "Merry Christmas! Today we celebrate the joyful birth of our Savior, Jesus Christ!"
};

// Safe, child-friendly Catholic historical facts for days without a major feast
const historicalFacts = [
  "In 1506, Pope Julius II laid the foundation stone for the beautiful St. Peter's Basilica in Rome.",
  "In 1223, St. Francis of Assisi created the very first live Nativity scene to help people celebrate Christmas.",
  "In 1531, The Blessed Virgin Mary appeared to St. Juan Diego in Mexico, known today as Our Lady of Guadalupe.",
  "In 1858, St. Bernadette saw her first beautiful vision of the Virgin Mary in Lourdes, France.",
  "In 1917, three shepherd children in Fatima, Portugal, witnessed the amazing Miracle of the Sun.",
  "In 1978, Pope St. John Paul II was elected, becoming known as the 'Pilgrim Pope' for traveling the world to spread God's love.",
  "In 313 AD, Emperor Constantine issued the Edict of Milan, finally allowing Christians to worship God freely and safely.",
  "In 1881, Blessed Michael McGivney founded the Knights of Columbus to help families and serve the community.",
  "In 1997, St. Teresa of Calcutta (Mother Teresa) was globally recognized for her beautiful life of serving the poorest of the poor.",
  "In 1522, St. Ignatius of Loyola began writing the 'Spiritual Exercises' to help people pray and grow closer to Jesus.",
  "In 1253, the magnificent Basilica of Saint Francis in Assisi was consecrated to honor the patron saint of animals."
];

const Home = ({ theme }) => {
  const [historyEvent, setHistoryEvent] = useState("");
  const [votd, setVotd] = useState(kidFriendlyVerses[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Set Verse of the Day
    setVotd(kidFriendlyVerses[dayOfYear % kidFriendlyVerses.length]);

    // Check for a Feast Day, otherwise load a historical fact
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateKey = `${month}-${day}`;
    
    if (feastDays[dateKey]) {
      setHistoryEvent(feastDays[dateKey]);
    } else {
      setHistoryEvent(historicalFacts[dayOfYear % historicalFacts.length]);
    }
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '30px', marginBottom: '25px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', flexShrink: 0 }}>
        <h2 style={{ color: theme.accent, fontSize: '2rem', marginTop: 0 }}>⭐ Verse of the Day</h2>
        <p style={{ color: theme.text, fontSize: '1.2rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{votd.text}"</p>
        <p style={{ color: theme.accent, textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>- {votd.ref}</p>
      </div>

      <div style={{ backgroundColor: theme.inputBg, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '30px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', flexShrink: 0 }}>
        <h2 style={{ color: theme.accent, fontSize: '2rem', marginTop: 0 }}>📅 Today in Catholic History</h2>
        <p style={{ color: theme.pageText, fontSize: '1.2rem', lineHeight: '1.6' }}>{historyEvent}</p>
      </div>
    </div>
  );
};

export default Home;