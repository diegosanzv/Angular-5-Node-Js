export let Cookie = {
  get(name: string) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]).split('.')[0] : undefined;
  },

  checkAdmin(name: string) {
    return name === 'admin';
  },

  deleteCookie() {
    document.cookie = 'login' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return null;
  }

}
