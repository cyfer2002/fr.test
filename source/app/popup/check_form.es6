
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.nameTeam.trim()) {
    errors.nameTeam = 'Ce champ est requis';
  }
  return errors;
}
