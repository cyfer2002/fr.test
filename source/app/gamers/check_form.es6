
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.name.trim()) {
    errors.name = 'Ce champ est requis';
  }
  if (!inputs.lastname.trim()) {
    errors.lastname = 'Ce champ est requis';
  }
  return errors;
}
