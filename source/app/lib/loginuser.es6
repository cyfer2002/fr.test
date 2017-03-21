
export default class LoginUser {
  static element(parent) {
    let $parent = $(parent);
    return $parent.length ? $parent : $('body .container:first');
  }

  static _display(username, parent) {
    let html = `
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" id="menu-item-login"> ${username}&nbsp;
      <span class="caret"></span></a>
    <ul class="dropdown-menu" aria-labelledby="menu-item-login">
      <li>
        <a href='#'>Profile</a>
      </li>
      <li>
          <a href="/gamersInsert">Ajout Participants</a>
      </li>
      <li>
         <a href="/gamers">Liste des participants</a>
      </li>
      <li>
        <a href='/logOut'>Deconnexion</a> 
      </li>
    </ul>
    `;
    (parent ? $(parent) : this.element()).replaceWith($(html));
  }
}