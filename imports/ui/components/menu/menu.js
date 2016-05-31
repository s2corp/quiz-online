import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './menu.html';

class Menu{
  constructor(){
  }

  showMenu(){
    if(document.getElementById('menuContent').style.display === 'none')
      document.getElementById('menuContent').style.display = 'inline';
    else
      document.getElementById('menuContent').style.display = 'none';
  }
}

const name = 'menu';

export default  angular.module(name, [
    angularMeteor,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Menu
})
