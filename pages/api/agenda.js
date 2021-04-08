import { firebaseServer } from '../../config/firebase/server';

const db = firebaseServer.firestore();
const agenda = db.collection('agenda');

export default async (req, res) => {
  const [, token] = req.headers.authorization.split(' ');
  if (!token) {
    return res.status(401);
  }

  try {
    const { user_id } = await firebaseServer.auth().verifyIdToken(token);

    const snapshot = await agenda
      .where('userId', '==', user_id)
      .where('when', '==', req.query.when)
      .get();
    return res.status(200).json(snapshot.docs);
  } catch (err) {
    console.log('error:', err);
    return res.status(401);
  }
};
