const BASE = '/api';

function getToken() { return localStorage.getItem('dy_token'); }

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sunucu hatası');
  return data;
}

export const api = {
  // AUTH
  register: (body)    => req('POST', '/auth/register', body),
  login:    (body)    => req('POST', '/auth/login',    body),
  me:       ()        => req('GET',  '/auth/me'),

  // PATIENT
  getWeights:      ()     => req('GET',  '/patient/weights'),
  addWeight:       (w)    => req('POST', '/patient/weights', { weight: w }),
  getMeasurements: ()     => req('GET',  '/patient/measurements'),
  addMeasurement:  (body) => req('POST', '/patient/measurements', body),
  getMeals:        ()     => req('GET',  '/patient/meals'),
  addMeal:         (body) => req('POST', '/patient/meals', body),
  getChat:         ()     => req('GET',  '/patient/chat'),
  saveChat:        (body) => req('POST', '/patient/chat', body),
  getProfile:      ()     => req('GET',  '/patient/profile'),

  // ADMIN
  getPatients:    ()          => req('GET',   '/admin/patients'),
  getPatient:     (id)        => req('GET',   `/admin/patients/${id}`),
  setStage:       (id, stage) => req('PATCH', `/admin/patients/${id}/stage`, { stage }),
  setNotes:       (id, notes) => req('PATCH', `/admin/patients/${id}/notes`, { notes }),
  getStats:       ()          => req('GET',   '/admin/stats'),
  getPatientMeasurements: (id)=> req('GET',   `/admin/patients/${id}/measurements`),
};
