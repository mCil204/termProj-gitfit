
//https://rapidapi.com/justin-hurt/api/exercisedb

const ExerciseAPI_Key = process.env.ExerciseAPI_Key;
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const BASE_URL      = 'https://exercisedb.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key':  ExerciseAPI_Key,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
};

async function getExercisesByBodyPart(bodyPart, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=0`,
    { headers }
  );
  if (!res.ok) throw new Error(`ExerciseDB error: ${res.status}`);
  return res.json();
}

async function getBodyPartList() {
  const res = await fetch(`${BASE_URL}/exercises/bodyPartList`, { headers });
  if (!res.ok) throw new Error(`ExerciseDB error: ${res.status}`);
  return res.json();
}

async function searchExercises(name, limit = 10) {
  const res = await fetch(
    `${BASE_URL}/exercises/name/${encodeURIComponent(name)}?limit=${limit}&offset=0`,
    { headers }
  );
  if (!res.ok) throw new Error(`ExerciseDB error: ${res.status}`);
  return res.json();
}

module.exports = { getExercisesByBodyPart, getBodyPartList, searchExercises };
