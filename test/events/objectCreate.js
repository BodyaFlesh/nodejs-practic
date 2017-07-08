var person = {
    firstname: '',
    lastname: 'Doe',
    greet: function(){
        return this.firstname + ' ' + this.lastname;
    }
}

var john = Object.create(person);
john.firstname = 'John';

console.log(john.greet())