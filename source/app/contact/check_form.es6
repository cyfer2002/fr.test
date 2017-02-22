
var REG_EMAIL = /^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export default function checkForm(inputs) {
  var errors = {};
  if (!inputs.name.trim()) {
    errors.name = 'Ce champ est requis';
  }
  if (!inputs.email.trim()) {
    errors.email = 'Ce champ est requis';
  } else if (!REG_EMAIL.test(inputs.email)) {
    errors.email = 'Addresse email invalide';
  }
  if (!inputs.origin.trim()) {
    errors.origin = 'Ce champ est requis';
  }
  if (!inputs.message.trim()) {
    errors.message = 'Ce champ est requis';
  }
  return errors;
}
