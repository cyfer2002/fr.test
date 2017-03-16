
export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.username.trim()) {
    errors.username = 'Ce champ est requis';
  }
  if (!inputs.password.trim()) {
    errors.password = 'Ce champ est requis';
  }
  return errors;
}
