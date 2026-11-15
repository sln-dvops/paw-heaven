/** Pure, testable application rules. No React or browser APIs required. */
export function hasActiveApplication(applications, userId, petId) {
  return applications.some(a => a.userId === userId && a.petId === petId && !['Rejected', 'Cancelled'].includes(a.status));
}
export function isSlotBooked(applications, petId, date, slot) {
  return applications.some(a => a.petId === petId && a.date === date && a.slot === slot && !['Rejected', 'Cancelled'].includes(a.status));
}
export function remainingSeats(registrations, event) {
  if (!event) return 0;
  return Math.max(0, Number(event.capacity) - registrations.filter(r => r.eventId === event.id).length);
}
export function filterPets(pets, {
  search = '',
  species = 'All',
  age = 'All',
  size = 'All',
  energy = 'All',
  gender = 'All',
  status = 'All',
  sort = 'name',
  onlyFav = false,
  favorites = [],
  userId = null
} = {}) {
  const query = search.trim().toLowerCase();
  const ages = {
    Baby: 0,
    Young: 1,
    Adult: 2,
    Senior: 3
  };
  return pets.filter(p => p.status === 'Available' && [p.name, p.breed, p.personality || ''].some(x => x.toLowerCase().includes(query)) && (species === 'All' || p.species === species) && (age === 'All' || p.ageGroup === age) && (size === 'All' || p.size === size) && (energy === 'All' || p.energy === energy) && (gender === 'All' || p.gender === gender) && (status === 'All' || p.status === status) && (!onlyFav || favorites.some(f => f.userId === userId && f.petId === p.id))).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'young' ? (ages[a.ageGroup] ?? 4) - (ages[b.ageGroup] ?? 4) : a.species.localeCompare(b.species));
}
export function findMatches(pets, answers) {
  return pets.filter(p => p.status === 'Available').map(p => {
    let score = 0;
    if (answers.species === p.species) score += 3;else if (answers.species === 'Either') score++;
    if (p.energy === answers.energy) score += 3;
    if (answers.space === 'Cosy apartment' && p.size === 'Small') score += 2;
    if (answers.space === 'Room to roam' && p.size !== 'Small') score++;
    if (answers.time === 'A relaxed routine' && p.energy === 'Calm') score += 2;
    if (answers.time === 'Lots of active play' && p.energy === 'Playful') score += 2;
    return {
      ...p,
      score
    };
  }).sort((a, b) => b.score - a.score).slice(0, 2);
}
export function validDonationAmount(amount) {
  const value = Number(amount);
  return Number.isFinite(value) && value >= 0.01 && value <= 10000 && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
}
export const appointmentSlots = ['10:00', '11:30', '14:00', '15:30'];
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function tomorrowDate(now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + 1);
  return localDate(date);
}
export function validAppointment(date, slot, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return false;
  const parsed = new Date(`${date}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && localDate(parsed) === date && date >= tomorrowDate(now) && appointmentSlots.includes(slot);
}
export function eventHasEnded(event, now = new Date()) {
  const start = new Date(`${event.date}T${event.time || '00:00'}`);
  return Number.isNaN(start.getTime()) || start <= now;
}
